import { initDropzone } from '../../src/js/dropzone.js';
import { downloadBlob, showToast, getEl } from '../../src/js/utils.js';

let currentFile = null;
let originalImage = new Image();

const ui = {
    dropZone: getEl('drop-zone'),
    fileInfo: getEl('file-info'),
    fileName: getEl('file-name'),
    imagePreview: getEl('image-preview'),
    btnRemove: getEl('btn-remove'),
    btnConvert: getEl('btn-convert'),
    canvas: getEl('render-canvas')
};

initDropzone('drop-zone', 'file-input', handleFileSelection, { accept: 'image/jpeg, image/jpg, image/webp', multiple: false });

ui.btnRemove.addEventListener('click', resetUI);
ui.btnConvert.addEventListener('click', convertImage);

function handleFileSelection(files) {
    const file = files[0];
    if (!file.type.startsWith('image/')) return;

    currentFile = file;
    ui.fileName.textContent = file.name;
    
    const objUrl = URL.createObjectURL(file);
    ui.imagePreview.src = objUrl;

    originalImage.onload = () => {
        ui.dropZone.classList.add('hidden');
        ui.fileInfo.classList.remove('hidden');
        ui.btnConvert.classList.remove('hidden');
    };
    originalImage.src = objUrl;
}

function resetUI() {
    if (ui.imagePreview.src) URL.revokeObjectURL(ui.imagePreview.src);
    currentFile = null;
    originalImage.src = '';
    
    ui.fileInfo.classList.add('hidden');
    ui.btnConvert.classList.add('hidden');
    ui.dropZone.classList.remove('hidden');
}

async function convertImage() {
    if (!currentFile) return;

    const w = originalImage.naturalWidth;
    const h = originalImage.naturalHeight;
    const ctx = ui.canvas.getContext('2d');
    
    ui.canvas.width = w;
    ui.canvas.height = h;
    ctx.drawImage(originalImage, 0, 0, w, h);

    ui.canvas.toBlob((blob) => {
        if (!blob) {
            showToast('Failed to convert image.', 'error');
            return;
        }
        showToast('Converted to PNG!');
        const baseName = currentFile.name.replace(/\.[^/.]+$/, "");
        downloadBlob(blob, `${baseName}.png`);
        resetUI();
    }, 'image/png');
}
