import { PDFDocument, degrees } from 'pdf-lib';
import { initDropzone } from '../../src/js/dropzone.js';
import { downloadBlob, showToast, getEl } from '../../src/js/utils.js';

let currentFile = null;
let rotatedPdfBytes = null;

const ui = {
    dropZone: getEl('drop-zone'),
    fileInfo: getEl('file-info'),
    fileName: getEl('file-name'),
    btnRemove: getEl('btn-remove'),
    btnProcess: getEl('btn-process'),
    rotationVal: getEl('rotation-val'),
    loader: getEl('loader'),
    resultArea: getEl('result-area'),
    btnDownload: getEl('btn-download'),
    btnRestart: getEl('btn-restart')
};

initDropzone('drop-zone', 'file-input', handleFileSelection, { accept: '.pdf', multiple: false });

ui.btnRemove.addEventListener('click', resetUI);
ui.btnRestart.addEventListener('click', resetUI);
ui.btnProcess.addEventListener('click', processPdf);
ui.btnDownload.addEventListener('click', () => {
    if (rotatedPdfBytes && currentFile) {
        const blob = new Blob([rotatedPdfBytes], { type: 'application/pdf' });
        const baseName = currentFile.name.replace(/\.pdf$/i, '');
        downloadBlob(blob, `${baseName}-rotated.pdf`);
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
    rotatedPdfBytes = null;
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

    try {
        const arrayBuffer = await currentFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pages = pdfDoc.getPages();
        const rotVal = parseInt(ui.rotationVal.value);
        
        for (const page of pages) {
            const currentRotation = page.getRotation().angle;
            page.setRotation(degrees((currentRotation + rotVal) % 360));
        }
        
        rotatedPdfBytes = await pdfDoc.save();
        
        ui.loader.classList.add('hidden');
        ui.loader.classList.remove('flex');
        ui.resultArea.classList.remove('hidden');
        showToast('PDF rotated successfully!');
    } catch (error) {
        console.error("PDF Rotation Error:", error);
        showToast('Error occurred during rotation.', 'error');
        ui.fileInfo.classList.remove('hidden');
        ui.fileInfo.classList.add('flex');
        ui.loader.classList.add('hidden');
        ui.loader.classList.remove('flex');
    }
}
