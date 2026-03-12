import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
import JSZip from 'jszip';
import { initDropzone } from '../../src/js/dropzone.js';
import { downloadBlob, showToast, getEl } from '../../src/js/utils.js';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

let currentFile = null;
let conversionZipBlob = null;

const ui = {
    dropZone: getEl('drop-zone'),
    fileInfo: getEl('file-info'),
    fileName: getEl('file-name'),
    btnRemove: getEl('btn-remove'),
    btnConvert: getEl('btn-convert'),
    loader: getEl('loader'),
    progressText: getEl('progress-text'),
    resultArea: getEl('result-area'),
    btnDownload: getEl('btn-download'),
    btnRestart: getEl('btn-restart'),
    canvas: getEl('render-canvas')
};

initDropzone('drop-zone', 'file-input', handleFileSelection, { accept: '.pdf', multiple: false });

ui.btnRemove.addEventListener('click', resetUI);
ui.btnRestart.addEventListener('click', resetUI);
ui.btnConvert.addEventListener('click', convertPdf);
ui.btnDownload.addEventListener('click', () => {
    if (conversionZipBlob && currentFile) {
        const baseName = currentFile.name.replace(/\.pdf$/i, '');
        downloadBlob(conversionZipBlob, `${baseName}_pngs.zip`);
    }
});

function handleFileSelection(files) {
    const file = files[0];
    if (file.type !== 'application/pdf') return;

    currentFile = file;
    ui.fileName.textContent = file.name;
    
    ui.dropZone.classList.add('hidden');
    ui.fileInfo.classList.remove('hidden');
    ui.btnConvert.classList.remove('hidden');
    ui.fileInfo.classList.add('flex');
}

function resetUI() {
    currentFile = null;
    conversionZipBlob = null;
    ui.fileInfo.classList.add('hidden');
    ui.fileInfo.classList.remove('flex');
    ui.btnConvert.classList.add('hidden');
    ui.resultArea.classList.add('hidden');
    ui.loader.classList.add('hidden');
    ui.loader.classList.remove('flex');
    ui.dropZone.classList.remove('hidden');
}

async function convertPdf() {
    if (!currentFile) return;
    ui.btnConvert.classList.add('hidden');
    ui.loader.classList.remove('hidden');
    ui.loader.classList.add('flex');
    ui.progressText.textContent = "Loading PDF engine...";

    try {
        const arrayBuffer = await currentFile.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
        const pdf = await loadingTask.promise;
        const numPages = pdf.numPages;
        
        const zip = new JSZip();
        const baseName = currentFile.name.replace(/\.pdf$/i, '');
        const ctx = ui.canvas.getContext('2d');

        for (let i = 1; i <= numPages; i++) {
            ui.progressText.textContent = `Rendering page ${i} of ${numPages}...`;
            
            const page = await pdf.getPage(i);
            
            // Higher scale for great PNG quality
            const viewport = page.getViewport({ scale: 2.0 });
            
            ui.canvas.width = viewport.width;
            ui.canvas.height = viewport.height;
            
            const renderContext = {
                canvasContext: ctx,
                viewport: viewport
            };
            
            await page.render(renderContext).promise;
            
            const blob = await new Promise(resolve => ui.canvas.toBlob(resolve, 'image/png'));
            
            const padLen = String(numPages).length;
            const pageNum = String(i).padStart(padLen, '0');
            zip.file(`${baseName}_page_${pageNum}.png`, blob);
        }

        ui.progressText.textContent = "Packaging ZIP file...";
        conversionZipBlob = await zip.generateAsync({ type: 'blob' });
        
        ui.loader.classList.add('hidden');
        ui.loader.classList.remove('flex');
        ui.resultArea.classList.remove('hidden');
        showToast('Converted to PNG successfully!');
    } catch (error) {
        console.error("PDF to PNG Error:", error);
        showToast('Error occurred during conversion.', 'error');
        ui.btnConvert.classList.remove('hidden');
        ui.loader.classList.add('hidden');
        ui.loader.classList.remove('flex');
    }
}
