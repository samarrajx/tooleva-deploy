import { PDFDocument } from 'pdf-lib';
import { initDropzone } from '../../src/js/dropzone.js';
import { downloadBlob, showToast, getEl } from '../../src/js/utils.js';

let currentFile = null;
let unlockedPdfBytes = null;

const ui = {
    dropZone: getEl('drop-zone'),
    fileInfo: getEl('file-info'),
    fileName: getEl('file-name'),
    btnRemove: getEl('btn-remove'),
    btnProcess: getEl('btn-process'),
    passwordInput: getEl('pdf-password'),
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
    if (unlockedPdfBytes && currentFile) {
        const blob = new Blob([unlockedPdfBytes], { type: 'application/pdf' });
        const baseName = currentFile.name.replace(/\.pdf$/i, '');
        downloadBlob(blob, `${baseName}-unlocked.pdf`);
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
    ui.passwordInput.value = '';
}

function resetUI() {
    currentFile = null;
    unlockedPdfBytes = null;
    ui.fileInfo.classList.add('hidden');
    ui.fileInfo.classList.remove('flex');
    ui.resultArea.classList.add('hidden');
    ui.loader.classList.add('hidden');
    ui.loader.classList.remove('flex');
    ui.dropZone.classList.remove('hidden');
}

async function processPdf() {
    if (!currentFile) return;
    
    const password = ui.passwordInput.value.trim();
    if (!password) {
        showToast('Please enter the PDF password first.', 'error');
        return;
    }

    ui.fileInfo.classList.add('hidden');
    ui.fileInfo.classList.remove('flex');
    ui.loader.classList.remove('hidden');
    ui.loader.classList.add('flex');

    try {
        const arrayBuffer = await currentFile.arrayBuffer();
        
        // Attempt to load document with provided password
        const pdfDoc = await PDFDocument.load(arrayBuffer, { password: password });
        
        // Saving the document automatically removes the encryption if done via pdf-lib
        unlockedPdfBytes = await pdfDoc.save();
        
        ui.loader.classList.add('hidden');
        ui.loader.classList.remove('flex');
        ui.resultArea.classList.remove('hidden');
        showToast('PDF unlocked successfully!');
    } catch (error) {
        console.error("PDF Unlock Error:", error);
        
        if (error.message && error.message.includes('password')) {
            showToast('Invalid password provided.', 'error');
        } else {
            showToast('Error unlocking PDF. Document may be unreadable.', 'error');
        }
        
        ui.fileInfo.classList.remove('hidden');
        ui.fileInfo.classList.add('flex');
        ui.loader.classList.add('hidden');
        ui.loader.classList.remove('flex');
    }
}
