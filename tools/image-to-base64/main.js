import { initDropzone } from '../../src/js/dropzone.js';
import { showToast, getEl } from '../../src/js/utils.js';

let currentFile = null;

const ui = {
    dropZone: getEl('drop-zone'),
    fileInput: getEl('file-input'),
    editorArea: getEl('editor-area'),
    fileName: getEl('file-name'),
    fileSize: getEl('file-size'),
    imagePreview: getEl('image-preview'),
    btnRemove: getEl('btn-remove'),
    btnConvert: getEl('btn-convert'),
    prefixFormat: getEl('prefix-format'),
    loader: getEl('loader'),
    resultArea: getEl('result-area'),
    base64Output: getEl('base64-output'),
    btnCopy: getEl('btn-copy'),
    btnRestart: getEl('btn-restart')
};

initDropzone('drop-zone', 'file-input', handleFileSelection, { accept: 'image/*', multiple: false });

ui.btnRemove.addEventListener('click', resetUI);
ui.btnRestart.addEventListener('click', resetUI);
ui.btnConvert.addEventListener('click', convertToBase64);

ui.btnCopy.addEventListener('click', () => {
    ui.base64Output.select();
    ui.base64Output.setSelectionRange(0, 9999999);
    navigator.clipboard.writeText(ui.base64Output.value).then(() => {
        showToast('Base64 copied to clipboard!', 'success');
    }).catch(() => {
        showToast('Failed to copy. Please copy manually.', 'error');
    });
});

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function handleFileSelection(files) {
    const file = files[0];
    if (!file.type.startsWith('image/')) {
        showToast('Please upload a valid image file.', 'error');
        return;
    }
    
    // Warn if file is over 2MB since base64 strings get very large
    if (file.size > 2 * 1024 * 1024) {
        showToast('Large images will generate massive text strings, which may lag your browser.', 'warning');
    }

    currentFile = file;
    ui.fileName.textContent = file.name;
    ui.fileSize.textContent = formatBytes(file.size);
    
    // Load preview
    const objectUrl = URL.createObjectURL(file);
    ui.imagePreview.src = objectUrl;
    
    ui.dropZone.classList.add('hidden');
    ui.editorArea.classList.remove('hidden');
    ui.editorArea.classList.add('flex');
}

function convertToBase64() {
    if (!currentFile) return;
    
    ui.editorArea.classList.add('hidden');
    ui.editorArea.classList.remove('flex');
    ui.loader.classList.remove('hidden');
    ui.loader.classList.add('flex');
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
        let base64String = e.target.result;
        
        // Remove data uri prefix if 'raw' is selected
        if (ui.prefixFormat.value === 'raw') {
            base64String = base64String.split(',')[1];
        }
        
        ui.base64Output.value = base64String;
        
        ui.loader.classList.add('hidden');
        ui.loader.classList.remove('flex');
        ui.resultArea.classList.remove('hidden');
        
        showToast('Encoding complete!');
    };
    
    reader.onerror = () => {
        showToast('Error reading the file.', 'error');
        resetUI();
    };
    
    // Read the file entirely into a base64 encoded data URI
    reader.readAsDataURL(currentFile);
}

function resetUI() {
    currentFile = null;
    
    if (ui.imagePreview.src) {
        URL.revokeObjectURL(ui.imagePreview.src);
        ui.imagePreview.src = '';
    }
    
    ui.base64Output.value = '';
    
    ui.editorArea.classList.add('hidden');
    ui.editorArea.classList.remove('flex');
    ui.resultArea.classList.add('hidden');
    ui.loader.classList.add('hidden');
    ui.loader.classList.remove('flex');
    ui.dropZone.classList.remove('hidden');
    ui.fileInput.value = '';
}
