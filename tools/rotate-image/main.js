import { initDropzone } from '../../src/js/dropzone.js';
import { downloadBlob, showToast, getEl } from '../../src/js/utils.js';

let currentFile = null;
let originalImage = new Image();
let originalMimeType = 'image/jpeg';
let modifiedBlob = null;

// Transformation State
let state = {
    rotation: 0,
    flipH: 1,
    flipV: 1
};

const ui = {
    dropZone: getEl('drop-zone'),
    editorArea: getEl('editor-area'),
    canvas: getEl('preview-canvas'),
    btnCancel: getEl('btn-cancel'),
    btnSave: getEl('btn-save'),
    btnRotateCCW: getEl('btn-rotate-ccw'),
    btnRotateCW: getEl('btn-rotate-cw'),
    btnFlipH: getEl('btn-flip-h'),
    btnFlipV: getEl('btn-flip-v'),
    resultArea: getEl('result-area'),
    btnDownload: getEl('btn-download'),
    btnRestart: getEl('btn-restart')
};

initDropzone('drop-zone', 'file-input', handleFileSelection, { accept: 'image/*', multiple: false });

ui.btnCancel.addEventListener('click', resetUI);
ui.btnRestart.addEventListener('click', resetUI);

ui.btnRotateCCW.addEventListener('click', () => { state.rotation -= 90; drawImage(); });
ui.btnRotateCW.addEventListener('click', () => { state.rotation += 90; drawImage(); });
ui.btnFlipH.addEventListener('click', () => { state.flipH *= -1; drawImage(); });
ui.btnFlipV.addEventListener('click', () => { state.flipV *= -1; drawImage(); });

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
        downloadBlob(modifiedBlob, `${baseName}-rotated.${extension}`);
    }
});

function handleFileSelection(files) {
    const file = files[0];
    if (!file.type.startsWith('image/')) return;

    currentFile = file;
    originalMimeType = file.type;
    
    // Reset state
    state = { rotation: 0, flipH: 1, flipV: 1 };
    
    const url = URL.createObjectURL(file);
    originalImage.src = url;
    
    originalImage.onload = () => {
        ui.dropZone.classList.add('hidden');
        ui.editorArea.classList.remove('hidden');
        ui.editorArea.classList.add('flex');
        drawImage();
    };
}

function drawImage() {
    const ctx = ui.canvas.getContext('2d');
    
    const normalizedRotation = ((state.rotation % 360) + 360) % 360;
    const isVertical = normalizedRotation === 90 || normalizedRotation === 270;
    
    ui.canvas.width = isVertical ? originalImage.height : originalImage.width;
    ui.canvas.height = isVertical ? originalImage.width : originalImage.height;
    
    ctx.clearRect(0, 0, ui.canvas.width, ui.canvas.height);
    
    ctx.translate(ui.canvas.width / 2, ui.canvas.height / 2);
    ctx.rotate(state.rotation * Math.PI / 180);
    ctx.scale(state.flipH, state.flipV);
    
    ctx.drawImage(
        originalImage, 
        -originalImage.width / 2, 
        -originalImage.height / 2, 
        originalImage.width, 
        originalImage.height
    );
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
