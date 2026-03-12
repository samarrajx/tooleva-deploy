import { initDropzone } from '../../src/js/dropzone.js';
import { downloadBlob, showToast, getEl } from '../../src/js/utils.js';

let currentFile = null;
let originalImage = new Image();
let originalMimeType = 'image/jpeg';
let modifiedBlob = null;

let currentBlur = 5;

const ui = {
    dropZone: getEl('drop-zone'),
    editorArea: getEl('editor-area'),
    canvas: getEl('preview-canvas'),
    btnCancel: getEl('btn-cancel'),
    btnSave: getEl('btn-save'),
    blurRange: getEl('blur-range'),
    blurDisplay: getEl('blur-val-display'),
    resultArea: getEl('result-area'),
    btnDownload: getEl('btn-download'),
    btnRestart: getEl('btn-restart')
};

initDropzone('drop-zone', 'file-input', handleFileSelection, { accept: 'image/*', multiple: false });

ui.btnCancel.addEventListener('click', resetUI);
ui.btnRestart.addEventListener('click', resetUI);

ui.blurRange.addEventListener('input', (e) => {
    currentBlur = parseInt(e.target.value);
    ui.blurDisplay.textContent = currentBlur + 'px';
    requestAnimationFrame(drawImage);
});

ui.btnSave.addEventListener('click', () => {
    let quality = originalMimeType === 'image/jpeg' ? 0.9 : undefined;
    
    ui.canvas.toBlob((blob) => {
        modifiedBlob = blob;
        ui.editorArea.classList.add('hidden');
        ui.editorArea.classList.remove('flex');
        ui.resultArea.classList.remove('hidden');
        showToast('Image saved successfully!');
    }, originalMimeType, quality);
});

ui.btnDownload.addEventListener('click', () => {
    if (modifiedBlob && currentFile) {
        const extension = originalMimeType.split('/')[1] || 'jpg';
        const baseName = currentFile.name.replace(/\.[^/.]+$/, '');
        downloadBlob(modifiedBlob, `${baseName}-blurred.${extension}`);
    }
});

function handleFileSelection(files) {
    const file = files[0];
    if (!file.type.startsWith('image/')) return;

    currentFile = file;
    originalMimeType = file.type;
    
    // Reset state
    currentBlur = 5;
    ui.blurRange.value = 5;
    ui.blurDisplay.textContent = '5px';
    
    const url = URL.createObjectURL(file);
    originalImage.src = url;
    
    originalImage.onload = () => {
        ui.dropZone.classList.add('hidden');
        ui.editorArea.classList.remove('hidden');
        ui.editorArea.classList.add('flex');
        
        // initialize canvas size
        ui.canvas.width = originalImage.width;
        ui.canvas.height = originalImage.height;
        
        drawImage();
    };
}

function drawImage() {
    const ctx = ui.canvas.getContext('2d');
    
    ctx.clearRect(0, 0, ui.canvas.width, ui.canvas.height);
    
    // Apply blur filter
    ctx.filter = `blur(${currentBlur}px)`;
    ctx.drawImage(originalImage, 0, 0, ui.canvas.width, ui.canvas.height);
    
    // Reset filter for anything else
    ctx.filter = 'none';
}

function resetUI() {
    currentFile = null;
    modifiedBlob = null;
    originalImage.src = '';
    
    const ctx = ui.canvas.getContext('2d');
    ctx.clearRect(0, 0, ui.canvas.width, ui.canvas.height);
    
    ui.editorArea.classList.add('hidden');
    ui.editorArea.classList.remove('flex');
    ui.resultArea.classList.add('hidden');
    ui.dropZone.classList.remove('hidden');
}
