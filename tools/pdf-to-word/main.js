import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
import { initDropzone } from '../../src/js/dropzone.js';
import { downloadBlob, showToast, getEl } from '../../src/js/utils.js';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

let currentFile = null;
let docBlob = null;

const ui = {
    dropZone: getEl('drop-zone'),
    fileInfo: getEl('file-info'),
    fileName: getEl('file-name'),
    btnRemove: getEl('btn-remove'),
    btnProcess: getEl('btn-process'),
    loader: getEl('loader'),
    progressText: getEl('progress-text'),
    resultArea: getEl('result-area'),
    btnDownload: getEl('btn-download'),
    btnRestart: getEl('btn-restart')
};

initDropzone('drop-zone', 'file-input', handleFileSelection, { accept: '.pdf', multiple: false });

ui.btnRemove.addEventListener('click', resetUI);
ui.btnRestart.addEventListener('click', resetUI);
ui.btnProcess.addEventListener('click', processPdf);
ui.btnDownload.addEventListener('click', () => {
    if (docBlob && currentFile) {
        const baseName = currentFile.name.replace(/\.pdf$/i, '');
        downloadBlob(docBlob, `${baseName}-extracted.doc`);
    }
});

function handleFileSelection(files) {
    const file = files[0];
    if (file.type !== 'application/pdf') return;

    currentFile = file;
    ui.fileName.textContent = file.name;
    
    ui.dropZone.classList.add('hidden');
    ui.fileInfo.classList.remove('hidden');
    ui.fileInfo.classList.add('flex');
}

function resetUI() {
    currentFile = null;
    docBlob = null;
    ui.fileInfo.classList.add('hidden');
    ui.fileInfo.classList.remove('flex');
    ui.resultArea.classList.add('hidden');
    ui.loader.classList.add('hidden');
    ui.loader.classList.remove('flex');
    ui.dropZone.classList.remove('hidden');
}

async function processPdf() {
    if (!currentFile) return;
    ui.fileInfo.classList.add('hidden');
    ui.fileInfo.classList.remove('flex');
    ui.loader.classList.remove('hidden');
    ui.loader.classList.add('flex');
    ui.progressText.textContent = "Parsing PDF document...";

    try {
        const arrayBuffer = await currentFile.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
        const pdf = await loadingTask.promise;
        const numPages = pdf.numPages;
        
        let fullText = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>`;

        for (let i = 1; i <= numPages; i++) {
            ui.progressText.textContent = `Extracting text from page ${i} of ${numPages}...`;
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            
            let pageText = textContent.items.map(item => item.str).join(' ');
            fullText += `<p>${pageText}</p>`;
            
            // Add page break (Word specific mso-special-character)
            if (i < numPages) {
                fullText += `<br clear=all style='mso-special-character:line-break;page-break-before:always'>`;
            }
        }
        
        fullText += `</body></html>`;

        // Create a basic HTML format recognizable by MS Word as a .doc file
        docBlob = new Blob(['\ufeff', fullText], {
            type: 'application/msword'
        });

        ui.loader.classList.add('hidden');
        ui.loader.classList.remove('flex');
        ui.resultArea.classList.remove('hidden');
        showToast('Extracted to Word successfully!');
    } catch (error) {
        console.error("PDF to Word Error:", error);
        showToast('Error extracting text. Document may be scanned or locked.', 'error');
        ui.fileInfo.classList.remove('hidden');
        ui.fileInfo.classList.add('flex');
        ui.loader.classList.add('hidden');
        ui.loader.classList.remove('flex');
    }
}
