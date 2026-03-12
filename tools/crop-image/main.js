import Cropper from 'cropperjs';
import { initDropzone } from '../../src/js/dropzone.js';
import { downloadBlob, showToast, getEl } from '../../src/js/utils.js';

let currentFile = null;
let cropper = null;
let croppedBlob = null;
let originalMimeType = 'image/jpeg';

const ui = {
    dropZone: getEl('drop-zone'),
    editorArea: getEl('editor-area'),
    imageEl: getEl('image-to-crop'),
    btnCancel: getEl('btn-cancel'),
    btnCrop: getEl('btn-crop'),
    btnRatioFree: getEl('btn-ratio-free'),
    btnRatio11: getEl('btn-ratio-1-1'),
    btnRatio169: getEl('btn-ratio-16-9'),
    btnRatio43: getEl('btn-ratio-4-3'),
    resultArea: getEl('result-area'),
    croppedPreview: getEl('cropped-preview'),
    btnDownload: getEl('btn-download'),
    btnRestart: getEl('btn-restart')
};

initDropzone('drop-zone', 'file-input', handleFileSelection, { accept: 'image/*', multiple: false });

ui.btnCancel.addEventListener('click', resetUI);
ui.btnRestart.addEventListener('click', resetUI);

ui.btnCrop.addEventListener('click', () => {
    if (!cropper) return;
    
    // Attempt to maintain format, fall back to png if transparent
    let format = originalMimeType;
    let quality = format === 'image/jpeg' ? 0.9 : undefined;
    
    const canvas = cropper.getCroppedCanvas({
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
    });
    
    // Show preview
    ui.croppedPreview.src = canvas.toDataURL(format, quality);

    canvas.toBlob((blob) => {
        croppedBlob = blob;
        ui.editorArea.classList.add('hidden');
        ui.editorArea.classList.remove('flex');
        ui.resultArea.classList.remove('hidden');
        showToast('Image cropped successfully!');
    }, format, quality);
});

ui.btnDownload.addEventListener('click', () => {
    if (croppedBlob && currentFile) {
        let extension = 'jpg';
        if (originalMimeType === 'image/png') extension = 'png';
        if (originalMimeType === 'image/webp') extension = 'webp';
        
        const baseName = currentFile.name.replace(/\.[^/.]+$/, '');
        downloadBlob(croppedBlob, `${baseName}-cropped.${extension}`);
    }
});

// Aspect Ratio Controls
const setAspectRatio = (ratio, activeBtn) => {
    if (cropper) cropper.setAspectRatio(ratio);
    
    // Reset classes
    [ui.btnRatioFree, ui.btnRatio11, ui.btnRatio169, ui.btnRatio43].forEach(btn => {
        btn.classList.remove('bg-indigo-100', 'text-indigo-700', 'dark:bg-indigo-900', 'border-indigo-300');
        btn.classList.add('bg-white', 'text-gray-700', 'dark:bg-slate-800');
    });
    
    // Set active
    activeBtn.classList.remove('bg-white', 'text-gray-700', 'dark:bg-slate-800');
    activeBtn.classList.add('bg-indigo-100', 'text-indigo-700', 'dark:bg-indigo-900', 'border-indigo-300');
};

ui.btnRatioFree.addEventListener('click', () => setAspectRatio(NaN, ui.btnRatioFree));
ui.btnRatio11.addEventListener('click', () => setAspectRatio(1, ui.btnRatio11));
ui.btnRatio169.addEventListener('click', () => setAspectRatio(16 / 9, ui.btnRatio169));
ui.btnRatio43.addEventListener('click', () => setAspectRatio(4 / 3, ui.btnRatio43));

function handleFileSelection(files) {
    const file = files[0];
    if (!file.type.startsWith('image/')) return;

    currentFile = file;
    originalMimeType = file.type;
    
    const url = URL.createObjectURL(file);
    ui.imageEl.src = url;
    
    ui.dropZone.classList.add('hidden');
    ui.editorArea.classList.remove('hidden');
    ui.editorArea.classList.add('flex');
    
    // Initialize Cropper after image is loaded into DOM
    if (cropper) {
        cropper.destroy();
    }
    
    ui.imageEl.onload = () => {
        cropper = new Cropper(ui.imageEl, {
            viewMode: 1, // Restrict crop box to not exceed size of canvas
            dragMode: 'crop',
            autoCropArea: 0.8,
            restore: false,
            guides: true,
            center: true,
            highlight: false,
            cropBoxMovable: true,
            cropBoxResizable: true,
            toggleDragModeOnDblclick: false,
        });
        
        // Highlight free ratio by default
        setAspectRatio(NaN, ui.btnRatioFree);
    };
}

function resetUI() {
    currentFile = null;
    croppedBlob = null;
    
    if (cropper) {
        cropper.destroy();
        cropper = null;
    }
    
    ui.imageEl.src = '';
    ui.editorArea.classList.add('hidden');
    ui.editorArea.classList.remove('flex');
    ui.resultArea.classList.add('hidden');
    ui.dropZone.classList.remove('hidden');
}
