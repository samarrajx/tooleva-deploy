import imageCompression from 'browser-image-compression';
import { initDropzone } from '../../src/js/dropzone.js';
import { formatBytes, downloadBlob, showToast, getEl } from '../../src/js/utils.js';

let currentFile = null;
let compressedFile = null;

const ui = {
    dropZone: getEl('drop-zone'),
    fileInfo: getEl('file-info'),
    fileName: getEl('file-name'),
    fileSize: getEl('file-size'),
    imagePreview: getEl('image-preview'),
    btnRemove: getEl('btn-remove'),
    btnCompress: getEl('btn-compress'),
    loader: getEl('loader'),
    resultArea: getEl('result-area'),
    savingsText: getEl('savings-text'),
    btnDownload: getEl('btn-download'),
    btnRestart: getEl('btn-restart')
};

initDropzone('drop-zone', 'file-input', handleFileSelection, { accept: 'image/*', multiple: false });

ui.btnRemove.addEventListener('click', resetUI);
ui.btnRestart.addEventListener('click', resetUI);
ui.btnCompress.addEventListener('click', compressImage);
ui.btnDownload.addEventListener('click', () => {
    if (compressedFile && currentFile) {
        downloadBlob(compressedFile, `compressed_${currentFile.name}`);
    }
});

function handleFileSelection(files) {
    const file = files[0];
    if (!file.type.startsWith('image/')) return;

    currentFile = file;
    ui.fileName.textContent = file.name;
    ui.fileSize.textContent = formatBytes(file.size);
    ui.imagePreview.src = URL.createObjectURL(file);
    
    ui.dropZone.classList.add('hidden');
    ui.fileInfo.classList.remove('hidden');
    ui.btnCompress.classList.remove('hidden');
}

function resetUI() {
    if (ui.imagePreview.src) URL.revokeObjectURL(ui.imagePreview.src);
    currentFile = null;
    compressedFile = null;
    ui.fileInfo.classList.add('hidden');
    ui.btnCompress.classList.add('hidden');
    ui.resultArea.classList.add('hidden');
    ui.dropZone.classList.remove('hidden');
}

async function compressImage() {
    if (!currentFile) return;

    ui.btnCompress.classList.add('hidden');
    ui.loader.classList.remove('hidden');

    const options = {
        maxSizeMB: 1, // Target max size
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        initialQuality: 0.8
    };

    try {
        compressedFile = await imageCompression(currentFile, options);
        
        const originalSize = currentFile.size;
        const newSize = compressedFile.size;
        
        if (newSize >= originalSize) {
            compressedFile = currentFile;
            ui.savingsText.textContent = `Image was already fully optimized.`;
        } else {
            const saved = originalSize - newSize;
            const percentage = ((saved / originalSize) * 100).toFixed(1);
            ui.savingsText.textContent = `You saved ${formatBytes(saved)} (${percentage}%)`;
        }

        ui.resultArea.classList.remove('hidden');
        showToast('Image compressed successfully!');
    } catch (error) {
        console.error("Image Compression error:", error);
        showToast('An error occurred. The image format might be unsupported.', 'error');
        resetUI();
    } finally {
        ui.loader.classList.add('hidden');
    }
}
