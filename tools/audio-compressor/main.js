import { fetchFile } from '@ffmpeg/util';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { initDropzone } from '../../src/js/dropzone.js';
import { downloadBlob, showToast, getEl } from '../../src/js/utils.js';

let currentFile = null;
let compressedBlob = null;
let ffmpeg = null;
let targetBitrate = '64k';

const ui = {
    dropZone: getEl('drop-zone'),
    fileInput: getEl('file-input'),
    editorArea: getEl('editor-area'),
    fileName: getEl('file-name'),
    fileSize: getEl('file-size'),
    btnRemove: getEl('btn-remove'),
    btnCompress: getEl('btn-compress'),
    loader: getEl('loader'),
    progressText: getEl('progress-text'),
    progressBar: getEl('progress-bar'),
    resultArea: getEl('result-area'),
    resultStats: getEl('result-stats'),
    audioPreview: getEl('audio-preview'),
    btnDownload: getEl('btn-download'),
    btnRestart: getEl('btn-restart'),
    presets: document.querySelectorAll('.level-preset')
};

initDropzone('drop-zone', 'file-input', handleFileSelection, { accept: 'audio/*', multiple: false });

ui.btnRemove.addEventListener('click', resetUI);
ui.btnRestart.addEventListener('click', resetUI);
ui.btnCompress.addEventListener('click', compressAudio);

ui.presets.forEach(btn => {
    btn.addEventListener('click', (e) => {
        ui.presets.forEach(b => b.classList.remove('border-primary-500', 'shadow-sm', 'bg-primary-50', 'dark:bg-primary-900/20'));
        e.currentTarget.classList.add('border-primary-500', 'shadow-sm', 'bg-primary-50', 'dark:bg-primary-900/20');
        targetBitrate = e.currentTarget.dataset.bitrate;
    });
});

ui.btnDownload.addEventListener('click', () => {
    if (compressedBlob && currentFile) {
        const baseName = currentFile.name.replace(/\.[^/.]+$/, '');
        downloadBlob(compressedBlob, `${baseName}-compressed.mp3`);
    }
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
    if (!file.type.startsWith('audio/')) {
        showToast('Please upload a valid audio file.', 'error');
        return;
    }

    currentFile = file;
    ui.fileName.textContent = file.name;
    ui.fileSize.textContent = formatBytes(file.size);
    
    ui.dropZone.classList.add('hidden');
    ui.editorArea.classList.remove('hidden');
    ui.editorArea.classList.add('flex');
}

async function loadFFmpeg() {
    if (ffmpeg) return ffmpeg;
    
    ffmpeg = new FFmpeg();
    ffmpeg.on('progress', ({ progress, time }) => {
        const percent = Math.min(Math.round(progress * 100), 100);
        ui.progressBar.style.width = `${percent}%`;
        ui.progressText.textContent = `Compressing: ${percent}%...`;
    });
    
    ui.progressText.textContent = "Loading Engine (first time only)...";
    
    await ffmpeg.load({
        coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js',
        wasmURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm'
    });
    
    return ffmpeg;
}

async function compressAudio() {
    if (!currentFile) return;
    
    ui.editorArea.classList.add('hidden');
    ui.editorArea.classList.remove('flex');
    ui.loader.classList.remove('hidden');
    ui.loader.classList.add('flex');
    ui.progressBar.style.width = '0%';
    ui.progressText.textContent = "Initializing...";

    try {
        const ff = await loadFFmpeg();
        const inputName = 'input' + currentFile.name.substring(currentFile.name.lastIndexOf('.'));
        const outputName = 'output.mp3';
        
        await ff.writeFile(inputName, await fetchFile(currentFile));
        
        const cmd = [
            '-i', inputName,
            '-c:a', 'libmp3lame',
            '-b:a', targetBitrate,
            '-y',
            outputName
        ];
        
        await ff.exec(cmd);
        
        const fileData = await ff.readFile(outputName);
        compressedBlob = new Blob([fileData.buffer], { type: 'audio/mpeg' });
        
        const originalSize = formatBytes(currentFile.size);
        const newSize = formatBytes(compressedBlob.size);
        ui.resultStats.textContent = `Original: ${originalSize} ➔ New: ${newSize}`;
        
        ui.audioPreview.src = URL.createObjectURL(compressedBlob);
        
        ui.loader.classList.add('hidden');
        ui.loader.classList.remove('flex');
        ui.resultArea.classList.remove('hidden');
        showToast(`Audio compressed successfully!`);
        
    } catch (err) {
        console.error("FFmpeg Audio Compression Error:", err);
        showToast('Error compressing audio.', 'error');
        resetUI();
    }
}

function resetUI() {
    currentFile = null;
    compressedBlob = null;
    
    if (ui.audioPreview.src) {
        URL.revokeObjectURL(ui.audioPreview.src);
        ui.audioPreview.src = '';
    }
    
    ui.editorArea.classList.add('hidden');
    ui.editorArea.classList.remove('flex');
    ui.resultArea.classList.add('hidden');
    ui.loader.classList.add('hidden');
    ui.loader.classList.remove('flex');
    ui.dropZone.classList.remove('hidden');
    ui.fileInput.value = '';
}
