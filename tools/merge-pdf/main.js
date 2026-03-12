import { PDFDocument } from 'pdf-lib';
import { initDropzone } from '../../src/js/dropzone.js';
import { formatBytes, downloadBlob, showToast, getEl } from '../../src/js/utils.js';

let filesToMerge = [];
let mergedBlob = null;

const ui = {
    dropZone: getEl('drop-zone'),
    fileList: getEl('file-list'),
    btnAddMore: getEl('btn-add-more'),
    btnMerge: getEl('btn-merge'),
    loader: getEl('loader'),
    resultArea: getEl('result-area'),
    btnDownload: getEl('btn-download'),
    btnRestart: getEl('btn-restart'),
};

// Allow appending files
initDropzone('drop-zone', 'file-input', (files) => {
    handleFileSelection(files);
}, { accept: '.pdf', multiple: true });

ui.btnMerge.addEventListener('click', mergePdfs);
ui.btnRestart.addEventListener('click', resetUI);
ui.btnDownload.addEventListener('click', () => {
    if (mergedBlob) {
        downloadBlob(mergedBlob, `merged_document.pdf`);
    }
});

function handleFileSelection(files) {
    const valid = Array.from(files).filter(f => f.type === 'application/pdf');
    if (valid.length === 0) {
        showToast('Please select valid PDF files.', 'error');
        return;
    }

    filesToMerge = [...filesToMerge, ...valid];
    renderFileList();

    ui.dropZone.classList.add('hidden');
    ui.fileList.classList.remove('hidden');
    ui.btnAddMore.classList.remove('hidden');
    ui.btnMerge.classList.remove('hidden');
}

function removeSelectedFile(index) {
    filesToMerge.splice(index, 1);
    renderFileList();
    if (filesToMerge.length === 0) {
        resetUI();
    }
}

// Make globally available for inline onclick
window.removeSelectedFile = removeSelectedFile;

function renderFileList() {
    ui.fileList.innerHTML = filesToMerge.map((f, i) => `
        <div class="bg-white rounded-lg p-3 border border-gray-200 flex items-center justify-between shadow-sm">
            <div class="flex items-center gap-3 overflow-hidden">
                <span class="text-sm font-semibold text-gray-400 w-6">${i + 1}.</span>
                <svg class="w-6 h-6 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"></path></svg>
                <div class="truncate">
                    <p class="font-medium text-sm text-gray-900 truncate">${f.name}</p>
                    <p class="text-xs text-gray-500">${formatBytes(f.size)}</p>
                </div>
            </div>
            <button onclick="window.removeSelectedFile(${i})" class="text-gray-400 hover:text-red-500 focus:outline-none p-1">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>
    `).join('');
}

function resetUI() {
    filesToMerge = [];
    mergedBlob = null;
    ui.fileList.classList.add('hidden');
    ui.btnAddMore.classList.add('hidden');
    ui.btnMerge.classList.add('hidden');
    ui.resultArea.classList.add('hidden');
    ui.dropZone.classList.remove('hidden');
    ui.fileList.innerHTML = '';
}

async function mergePdfs() {
    if (filesToMerge.length < 2) {
        showToast('Please select at least 2 PDF files to merge.', 'error');
        return;
    }

    ui.btnMerge.classList.add('hidden');
    ui.btnAddMore.classList.add('hidden');
    ui.loader.classList.remove('hidden');

    try {
        const mergedPdf = await PDFDocument.create();

        for (const file of filesToMerge) {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
            
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        const pdfBytes = await mergedPdf.save();
        mergedBlob = new Blob([pdfBytes], { type: 'application/pdf' });
        
        ui.resultArea.classList.remove('hidden');
        showToast('PDFs merged successfully!');
    } catch (error) {
        console.error("PDF Merge error:", error);
        showToast('An error occurred while merging the PDFs.', 'error');
        ui.btnMerge.classList.remove('hidden');
        ui.btnAddMore.classList.remove('hidden');
    } finally {
        ui.loader.classList.add('hidden');
    }
}
