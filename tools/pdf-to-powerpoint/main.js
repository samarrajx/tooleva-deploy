import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
import PptxGenJS from 'pptxgenjs';
import { initDropzone } from '../../src/js/dropzone.js';
import { showToast, getEl } from '../../src/js/utils.js';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

let currentFile = null;

const ui = {
    dropZone: getEl('drop-zone'),
    fileInfo: getEl('file-info'),
    fileName: getEl('file-name'),
    btnRemove: getEl('btn-remove'),
    btnProcess: getEl('btn-process'),
    loader: getEl('loader'),
    progressText: getEl('progress-text'),
    resultArea: getEl('result-area'),
    downloadWrapper: getEl('download-wrapper'),
    btnRestart: getEl('btn-restart')
};

initDropzone('drop-zone', 'file-input', handleFileSelection, { accept: '.pdf', multiple: false });

ui.btnRemove.addEventListener('click', resetUI);
ui.btnRestart.addEventListener('click', resetUI);
ui.btnProcess.addEventListener('click', processPdf);

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
    ui.fileInfo.classList.add('hidden');
    ui.fileInfo.classList.remove('flex');
    ui.resultArea.classList.add('hidden');
    ui.loader.classList.add('hidden');
    ui.loader.classList.remove('flex');
    ui.dropZone.classList.remove('hidden');
    ui.downloadWrapper.innerHTML = '';
}

async function processPdf() {
    if (!currentFile) return;
    ui.fileInfo.classList.add('hidden');
    ui.fileInfo.classList.remove('flex');
    ui.loader.classList.remove('hidden');
    ui.loader.classList.add('flex');
    ui.progressText.textContent = "Analyzing PDF slides...";

    try {
        const arrayBuffer = await currentFile.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
        const pdf = await loadingTask.promise;
        const numPages = pdf.numPages;
        
        const pptx = new PptxGenJS();
        pptx.layout = 'LAYOUT_16x9';

        for (let i = 1; i <= numPages; i++) {
            ui.progressText.textContent = `Extracting text for Slide ${i} of ${numPages}...`;
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            
            const slide = pptx.addSlide();
            
            // Add a slide number at the bottom right
            slide.addText(`Slide ${i}`, { x: '90%', y: '90%', fontSize: 10, color: '888888' });
            
            if (textContent.items.length > 0) {
                // Determine title based on largest text size or top position
                let itemsCopy = [...textContent.items];
                
                // Sort by Y position (from top to bottom)
                itemsCopy.sort((a, b) => b.transform[5] - a.transform[5]);
                
                const titleItem = itemsCopy.shift();
                
                slide.addText(titleItem.str, { 
                    x: 0.5, y: 0.5, w: '90%', h: 1.0, 
                    fontSize: 24, bold: true, color: '363636', align: 'left'
                });
                
                // Remaining text goes into body
                const bodyText = itemsCopy.map(it => it.str).join(' ');
                
                if (bodyText.trim() !== '') {
                    slide.addText(bodyText, {
                        x: 0.5, y: 1.5, w: '90%', h: 3.5,
                        fontSize: 14, color: '555555', align: 'left', valign: 'top'
                    });
                }
            } else {
                slide.addText("No text extracted from this page.", { x: 0.5, y: 2, w: '90%', fontSize: 14, color: '999999', align: 'center' });
            }
        }

        ui.progressText.textContent = "Generating PPTX file...";
        
        const baseName = currentFile.name.replace(/\.pdf$/i, '');
        const fileName = `${baseName}-converted.pptx`;
        
        // Use pptxgenjs internal write to blob, then download using browser API
        const blobData = await pptx.write({ outputType: 'blob' });
        
        const downloadUrl = URL.createObjectURL(blobData);
        
        ui.downloadWrapper.innerHTML = `<a href="${downloadUrl}" download="${fileName}" class="btn-primary !bg-blue-600 hover:!bg-blue-700 text-lg px-8 py-3 inline-block">Download PPTX</a>`;

        ui.loader.classList.add('hidden');
        ui.loader.classList.remove('flex');
        ui.resultArea.classList.remove('hidden');
        showToast('Extracted to PowerPoint successfully!');
    } catch (error) {
        console.error("PDF to PowerPoint Error:", error);
        showToast('Error generating presentation.', 'error');
        ui.fileInfo.classList.remove('hidden');
        ui.fileInfo.classList.add('flex');
        ui.loader.classList.add('hidden');
        ui.loader.classList.remove('flex');
    }
}
