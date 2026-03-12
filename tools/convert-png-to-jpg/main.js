import { initDropzone } from '../../src/js/dropzone.js';
import { downloadBlob, showToast, getEl } from '../../src/js/utils.js';

let currentFile = null;
let originalImage = new Image();
let convertedBlob = null;

const ui = {
    dropZone: getEl('drop-zone'),
    fileInput: getEl('file-input'),
    editorArea: getEl('editor-area'),
    fileName: getEl('file-name'),
    btnRemove: getEl('btn-remove'),
    btnConvert: getEl('btn-convert'),
    qualityRange: getEl('quality-range'),
    qualityDisplay: getEl('quality-display'),
    loader: getEl('loader'),
    resultArea: getEl('result-area'),
    btnDownload: getEl('btn-download'),
    btnRestart: getEl('btn-restart'),
    canvas: getEl('render-canvas')
};

initDropzone('drop-zone', 'file-input', handleFileSelection, { accept: 'image/png', multiple: false });

ui.qualityRange.addEventListener('input', (e) => {
    ui.qualityDisplay.textContent = `${e.target.value}%`;
});

ui.btnRemove.addEventListener('click', resetUI);
ui.btnRestart.addEventListener('click', resetUI);

ui.btnConvert.addEventListener('click', processImage);

ui.btnDownload.addEventListener('click', () => {
    if (convertedBlob && currentFile) {
        const baseName = currentFile.name.replace(/\.[^/.]+$/, '');
        downloadBlob(convertedBlob, `${baseName}-converted.jpg`);
    }
});

function handleFileSelection(files) {
    const file = files[0];
    if (file.type !== 'image/png') {
        showToast('Please upload a valid PNG image.', 'error');
        return;
    }

    currentFile = file;
    ui.fileName.textContent = file.name;
    
    const url = URL.createObjectURL(file);
    originalImage.src = url;
    
    originalImage.onload = () => {
        ui.dropZone.classList.add('hidden');
        ui.editorArea.classList.remove('hidden');
        ui.editorArea.classList.add('flex');
    };
}

function processImage() {
    if (!currentFile) return;
    
    ui.editorArea.classList.add('hidden');
    ui.editorArea.classList.remove('flex');
    ui.loader.classList.remove('hidden');
    ui.loader.classList.add('flex');
    
    // Slight delay to allow UI to update loader
    setTimeout(() => {
        try {
            const ctx = ui.canvas.getContext('2d');
            
            ui.canvas.width = originalImage.width;
            ui.canvas.height = originalImage.height;
            
            // Fill white background for transparent PNGs
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, ui.canvas.width, ui.canvas.height);
            
            // Draw image on top
            ctx.drawImage(originalImage, 0, 0);
            
            const quality = parseInt(ui.qualityRange.value) / 100;
            
            ui.canvas.toBlob((blob) => {
                convertedBlob = blob;
                ui.loader.classList.add('hidden');
                ui.loader.classList.remove('flex');
                ui.resultArea.classList.remove('hidden');
                showToast('Converted to JPG successfully!');
            }, 'image/jpeg', quality);
            
        } catch (err) {
            console.error(err);
            showToast('Error converting image.', 'error');
            resetUI();
        }
    }, 100);
}

function resetUI() {
    currentFile = null;
    convertedBlob = null;
    originalImage.src = '';
    
    // Clear canvas
    const ctx = ui.canvas.getContext('2d');
    ctx.clearRect(0, 0, ui.canvas.width, ui.canvas.height);
    
    ui.editorArea.classList.add('hidden');
    ui.editorArea.classList.remove('flex');
    ui.resultArea.classList.add('hidden');
    ui.loader.classList.add('hidden');
    ui.loader.classList.remove('flex');
    ui.dropZone.classList.remove('hidden');
    ui.fileInput.value = '';
}
