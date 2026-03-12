import { initDropzone } from '../../src/js/dropzone.js';
import { formatBytes, downloadBlob, showToast, getEl } from '../../src/js/utils.js';

let currentFile = null;
let originalImage = new Image();
let aspectRatio = 1;

const ui = {
    dropZone: getEl('drop-zone'),
    configArea: getEl('config-area'),
    fileName: getEl('file-name'),
    origDims: getEl('original-dimensions'),
    imagePreview: getEl('image-preview'),
    inputWidth: getEl('input-width'),
    inputHeight: getEl('input-height'),
    maintainRatio: getEl('maintain-ratio'),
    btnCancel: getEl('btn-cancel'),
    btnResize: getEl('btn-resize'),
    canvas: getEl('render-canvas')
};

initDropzone('drop-zone', 'file-input', handleFileSelection, { accept: 'image/*', multiple: false });

ui.btnCancel.addEventListener('click', resetUI);
ui.btnResize.addEventListener('click', resizeImage);

ui.inputWidth.addEventListener('input', () => {
    if (ui.maintainRatio.checked && document.activeElement === ui.inputWidth) {
        const w = parseInt(ui.inputWidth.value) || 0;
        ui.inputHeight.value = Math.round(w / aspectRatio);
    }
});

ui.inputHeight.addEventListener('input', () => {
    if (ui.maintainRatio.checked && document.activeElement === ui.inputHeight) {
        const h = parseInt(ui.inputHeight.value) || 0;
        ui.inputWidth.value = Math.round(h * aspectRatio);
    }
});

function handleFileSelection(files) {
    const file = files[0];
    if (!file.type.startsWith('image/')) return;

    currentFile = file;
    ui.fileName.textContent = file.name;
    
    const objUrl = URL.createObjectURL(file);
    ui.imagePreview.src = objUrl;

    originalImage.onload = () => {
        const w = originalImage.naturalWidth;
        const h = originalImage.naturalHeight;
        aspectRatio = w / h;
        
        ui.origDims.textContent = `${w} x ${h} px (${formatBytes(file.size)})`;
        ui.inputWidth.value = w;
        ui.inputHeight.value = h;

        ui.dropZone.classList.add('hidden');
        ui.configArea.classList.remove('hidden');
    };
    originalImage.src = objUrl;
}

function resetUI() {
    if (ui.imagePreview.src) {
        URL.revokeObjectURL(ui.imagePreview.src);
    }
    currentFile = null;
    originalImage.src = '';
    
    ui.configArea.classList.add('hidden');
    ui.dropZone.classList.remove('hidden');
}

async function resizeImage() {
    if (!currentFile) return;

    const w = parseInt(ui.inputWidth.value);
    const h = parseInt(ui.inputHeight.value);

    if (!w || !h || w <= 0 || h <= 0) {
        showToast('Please enter valid dimensions above 0.', 'error');
        return;
    }

    const ctx = ui.canvas.getContext('2d');
    ui.canvas.width = w;
    ui.canvas.height = h;

    // Draw resized
    ctx.drawImage(originalImage, 0, 0, w, h);

    ui.canvas.toBlob((blob) => {
        if (!blob) {
            showToast('Failed to resize image.', 'error');
            return;
        }
        showToast('Image resized successfully!');
        const extMatch = currentFile.name.match(/\.([^.]+)$/);
        const ext = extMatch ? extMatch[1] : 'png';
        downloadBlob(blob, `resized_${w}x${h}.${ext}`);
    }, currentFile.type, 0.9);
}
