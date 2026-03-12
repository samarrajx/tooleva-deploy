import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { initDropzone } from '../../src/js/dropzone.js';
import { downloadBlob, showToast, getEl } from '../../src/js/utils.js';

let currentFile = null;
let currentPdfDoc = null;
let splitArchiveBlob = null;

const ui = {
    dropZone: getEl('drop-zone'),
    fileInfo: getEl('file-info'),
    fileName: getEl('file-name'),
    filePages: getEl('file-pages'),
    btnRemove: getEl('btn-remove'),
    btnSplit: getEl('btn-split'),
    loader: getEl('loader'),
    resultArea: getEl('result-area'),
    btnDownload: getEl('btn-download')
};

initDropzone('drop-zone', 'file-input', handleFileSelection, { accept: '.pdf', multiple: false });

ui.btnRemove.addEventListener('click', resetUI);
ui.btnSplit.addEventListener('click', splitPdf);
ui.btnDownload.addEventListener('click', () => {
    if (splitArchiveBlob && currentFile) {
        const baseName = currentFile.name.replace(/\.pdf$/i, '');
        downloadBlob(splitArchiveBlob, `${baseName}_pages.zip`);
    }
});

async function handleFileSelection(files) {
    const file = files[0];
    if (file.type !== 'application/pdf') return;

    ui.dropZone.classList.add('hidden');
    ui.loader.classList.remove('hidden');

    try {
        const arrayBuffer = await file.arrayBuffer();
        currentPdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        currentFile = file;
        
        const pageCount = currentPdfDoc.getPageCount();
        ui.fileName.textContent = file.name;
        ui.filePages.textContent = `${pageCount} Page${pageCount !== 1 ? 's' : ''}`;
        
        ui.loader.classList.add('hidden');
        ui.fileInfo.classList.remove('hidden');
        ui.btnSplit.classList.remove('hidden');
    } catch (e) {
        showToast('Error reading PDF file.', 'error');
        resetUI();
    }
}

function resetUI() {
    currentFile = null;
    currentPdfDoc = null;
    splitArchiveBlob = null;
    ui.fileInfo.classList.add('hidden');
    ui.btnSplit.classList.add('hidden');
    ui.resultArea.classList.add('hidden');
    ui.dropZone.classList.remove('hidden');
}

async function splitPdf() {
    if (!currentPdfDoc) return;
    ui.btnSplit.classList.add('hidden');
    ui.loader.classList.remove('hidden');

    try {
        const pageCount = currentPdfDoc.getPageCount();
        const zip = new JSZip();
        const baseName = currentFile.name.replace(/\.pdf$/i, '');

        for (let i = 0; i < pageCount; i++) {
            const newPdf = await PDFDocument.create();
            const [copiedPage] = await newPdf.copyPages(currentPdfDoc, [i]);
            newPdf.addPage(copiedPage);
            const pdfBytes = await newPdf.save();
            
            // Format page number with leading zeros based on total pages
            const padLen = String(pageCount).length;
            const pageNum = String(i + 1).padStart(padLen, '0');
            zip.file(`${baseName}_page_${pageNum}.pdf`, pdfBytes);
        }

        splitArchiveBlob = await zip.generateAsync({ type: 'blob' });
        
        ui.resultArea.classList.remove('hidden');
        showToast('Pages extracted and zipped successfully!');
    } catch (error) {
        console.error(error);
        showToast('Error occurred while splitting.', 'error');
        ui.btnSplit.classList.remove('hidden');
    } finally {
        ui.loader.classList.add('hidden');
    }
}
