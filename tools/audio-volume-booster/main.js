import { fetchFile } from '@ffmpeg/util';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { initDropzone } from '../../src/js/dropzone.js';
import { downloadBlob, showToast, getEl } from '../../src/js/utils.js';

let currentFile = null;
let processedBlob = null;
let ffmpeg = null;
let targetVol = 1.5;

const ui = {
    dropZone: getEl('drop-zone'),
    fileInput: getEl('file-input'),
    editorArea: getEl('editor-area'),
    fileName: getEl('file-name'),
    btnRemove: getEl('btn-remove'),
    btnProcess: getEl('btn-process'),
    loader: getEl('loader'),
    progressText: getEl('progress-text'),
    progressBar: getEl('progress-bar'),
    resultArea: getEl('result-area'),
    audioPreview: getEl('audio-preview'),
    btnDownload: getEl('btn-download'),
    btnRestart: getEl('btn-restart'),
    presets: document.querySelectorAll('.vol-preset')
};

initDropzone('drop-zone', 'file-input', handleFileSelection, { accept: 'audio/*', multiple: false });

ui.btnRemove.addEventListener('click', resetUI);
ui.btnRestart.addEventListener('click', resetUI);
ui.btnProcess.addEventListener('click', processAudio);

ui.presets.forEach(btn => {
    btn.addEventListener('click', (e) => {
        ui.presets.forEach(b => b.classList.remove('border-primary-500', 'shadow-sm', 'bg-primary-50', 'dark:bg-primary-900/20'));
        e.currentTarget.classList.add('border-primary-500', 'shadow-sm', 'bg-primary-50', 'dark:bg-primary-900/20');
        targetVol = parseFloat(e.currentTarget.dataset.vol);
    });
});

ui.btnDownload.addEventListener('click', () => {
    if (processedBlob && currentFile) {
        const baseName = currentFile.name.replace(/\.[^/.]+$/, '');
        downloadBlob(processedBlob, `${baseName}-vol-${targetVol}.mp3`);
    }
});

function handleFileSelection(files) {
    const file = files[0];
    if (!file.type.startsWith('audio/')) {
        showToast('Please upload a valid audio file.', 'error');
        return;
    }

    currentFile = file;
    ui.fileName.textContent = file.name;
    
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
        ui.progressText.textContent = `Processing: ${percent}%...`;
    });
    
    ui.progressText.textContent = "Loading Engine (first time only)...";
    
    await ffmpeg.load({
        coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js',
        wasmURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm'
    });
    
    return ffmpeg;
}

async function processAudio() {
    if (!currentFile) return;
    
    ui.editorArea.classList.add('hidden');
    ui.editorArea.classList.remove('flex');
    ui.loader.classList.remove('hidden');
    ui.loader.classList.add('flex');
    ui.progressBar.style.width = '0%';
    ui.progressText.textContent = "Initializing...";

    try {
        const ff = await loadFFmpeg();
        const ext = currentFile.name.substring(currentFile.name.lastIndexOf('.'));
        const inputName = `input${ext}`;
        const outputName = 'output.mp3';
        
        await ff.writeFile(inputName, await fetchFile(currentFile));
        
        const cmd = [
            '-i', inputName,
            '-filter:a', `volume=${targetVol}`,
            '-c:a', 'libmp3lame',
            '-q:a', '2',
            outputName
        ];
        
        await ff.exec(cmd);
        
        const fileData = await ff.readFile(outputName);
        processedBlob = new Blob([fileData.buffer], { type: 'audio/mpeg' });
        
        ui.audioPreview.src = URL.createObjectURL(processedBlob);
        
        ui.loader.classList.add('hidden');
        ui.loader.classList.remove('flex');
        ui.resultArea.classList.remove('hidden');
        showToast('Audio volume changed successfully!');
        
    } catch (err) {
        console.error("FFmpeg Volume Error:", err);
        showToast('Error changing volume. Audio stream may be missing or incompatible.', 'error');
        resetUI();
    }
}

function resetUI() {
    currentFile = null;
    processedBlob = null;
    
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
