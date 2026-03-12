import { initDropzone } from '../../src/js/dropzone.js';
import { downloadBlob, showToast, getEl } from '../../src/js/utils.js';

let currentFile = null;
let originalImage = new Image();
let originalMimeType = 'image/jpeg';
let modifiedBlob = null;

const ui = {
    dropZone: getEl('drop-zone'),
    editorArea: getEl('editor-area'),
    canvas: getEl('preview-canvas'),
    btnCancel: getEl('btn-cancel'),
    btnSave: getEl('btn-save'),
    textInput: getEl('watermark-text'),
    positionSelect: getEl('watermark-position'),
    colorInput: getEl('watermark-color'),
    opacitySelect: getEl('watermark-opacity'),
    sizeRange: getEl('watermark-size'),
    resultArea: getEl('result-area'),
    btnDownload: getEl('btn-download'),
    btnRestart: getEl('btn-restart')
};

initDropzone('drop-zone', 'file-input', handleFileSelection, { accept: 'image/*', multiple: false });

ui.btnCancel.addEventListener('click', resetUI);
ui.btnRestart.addEventListener('click', resetUI);

// Re-draw canvas on any input change
const inputs = [ui.textInput, ui.positionSelect, ui.colorInput, ui.opacitySelect, ui.sizeRange];
inputs.forEach(input => input.addEventListener('input', drawImage));

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
        downloadBlob(modifiedBlob, `${baseName}-watermarked.${extension}`);
    }
});

// Hex to RGB to add alpha channel
function hexToRgba(hex, alpha) {
    let r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function handleFileSelection(files) {
    const file = files[0];
    if (!file.type.startsWith('image/')) return;

    currentFile = file;
    originalMimeType = file.type;
    
    // Reset controls
    ui.textInput.value = '© Copyright';
    ui.positionSelect.value = 'bottom-right';
    ui.colorInput.value = '#ffffff';
    ui.opacitySelect.value = '0.5';
    
    const url = URL.createObjectURL(file);
    originalImage.src = url;
    
    originalImage.onload = () => {
        ui.dropZone.classList.add('hidden');
        ui.editorArea.classList.remove('hidden');
        ui.editorArea.classList.add('flex');
        
        // initialize canvas size
        ui.canvas.width = originalImage.width;
        ui.canvas.height = originalImage.height;
        
        // set default size to roughly 5% of height
        ui.sizeRange.value = Math.max(12, Math.floor(originalImage.height * 0.05));
        
        drawImage();
    };
}

function drawImage() {
    if (!currentFile) return;
    
    const ctx = ui.canvas.getContext('2d');
    
    // Draw original image
    ctx.clearRect(0, 0, ui.canvas.width, ui.canvas.height);
    ctx.drawImage(originalImage, 0, 0, ui.canvas.width, ui.canvas.height);
    
    const text = ui.textInput.value;
    if (!text.trim()) return;

    const fontSize = parseInt(ui.sizeRange.value);
    const alpha = parseFloat(ui.opacitySelect.value);
    const color = hexToRgba(ui.colorInput.value, alpha);
    const pos = ui.positionSelect.value;
    
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.fillStyle = color;
    
    // Add subtle shadow for visibility against light backgrounds
    ctx.shadowColor = `rgba(0, 0, 0, ${alpha * 0.8})`;
    ctx.shadowBlur = Math.max(2, fontSize * 0.1);
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    const padding = fontSize * 0.5;
    const cw = ui.canvas.width;
    const ch = ui.canvas.height;
    
    ctx.textBaseline = 'middle';
    
    if (pos === 'tile') {
        ctx.textAlign = 'center';
        // Rotate context for a watermark style
        ctx.save();
        ctx.translate(cw/2, ch/2);
        ctx.rotate(-Math.PI / 6); // -30 degrees
        
        const textMetrics = ctx.measureText(text);
        const textWidth = textMetrics.width + padding * 4;
        const textHeight = fontSize * 3;
        
        // Cover a grid larger than the canvas to account for rotation
        const maxDim = Math.max(cw, ch) * 1.5;
        
        for (let x = -maxDim; x < maxDim; x += textWidth) {
            for (let y = -maxDim; y < maxDim; y += textHeight) {
                ctx.fillText(text, x, y);
            }
        }
        ctx.restore();
    } else {
        // Normal positioning
        if (pos.includes('left')) {
            ctx.textAlign = 'left';
            var x = padding;
        } else if (pos.includes('right')) {
            ctx.textAlign = 'right';
            var x = cw - padding;
        } else {
            ctx.textAlign = 'center';
            var x = cw / 2;
        }
        
        if (pos.includes('top')) {
            var y = padding + fontSize/2;
        } else if (pos.includes('bottom')) {
            var y = ch - padding - fontSize/2;
        } else {
            var y = ch / 2;
        }
        
        ctx.fillText(text, x, y);
    }
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
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
