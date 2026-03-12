import { fetchFile } from '@ffmpeg/util';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { initDropzone } from '../../src/js/dropzone.js';
import { downloadBlob, showToast, getEl } from '../../src/js/utils.js';

let currentFile = null;
let trimmedBlob = null;
let ffmpeg = null;
let fileExt = '';

const ui = {
    dropZone: getEl('drop-zone'),
    fileInput: getEl('file-input'),
    editorArea: getEl('editor-area'),
    audioPreview: getEl('audio-preview'),
    startTime: getEl('start-time'),
    endTime: getEl('end-time'),
    btnSetStart: getEl('btn-set-start'),
    btnSetEnd: getEl('btn-set-end'),
    btnTrim: getEl('btn-trim'),
    loader: getEl('loader'),
    progressText: getEl('progress-text'),
    progressBar: getEl('progress-bar'),
    resultArea: getEl('result-area'),
    resultAudio: getEl('result-audio'),
    btnDownload: getEl('btn-download'),
    btnRestart: getEl('btn-restart')
};

initDropzone('drop-zone', 'file-input', handleFileSelection, { accept: 'audio/*', multiple: false });

ui.btnSetStart.addEventListener('click', () => {
    ui.startTime.value = ui.audioPreview.currentTime.toFixed(2);
});

ui.btnSetEnd.addEventListener('click', () => {
    ui.endTime.value = ui.audioPreview.currentTime.toFixed(2);
});

ui.btnRestart.addEventListener('click', resetUI);
ui.btnTrim.addEventListener('click', trimAudio);

ui.btnDownload.addEventListener('click', () => {
    if (trimmedBlob && currentFile) {
        const baseName = currentFile.name.replace(/\.[^/.]+$/, '');
        downloadBlob(trimmedBlob, `${baseName}-cut${fileExt}`);
    }
});

function handleFileSelection(files) {
    const file = files[0];
    if (!file.type.startsWith('audio/')) {
        showToast('Please upload a valid audio file.', 'error');
        return;
    }

    currentFile = file;
    fileExt = file.name.substring(file.name.lastIndexOf('.'));
    if (!fileExt) fileExt = '.mp3';
    
    const url = URL.createObjectURL(file);
    ui.audioPreview.src = url;
    
    ui.audioPreview.onloadedmetadata = () => {
        ui.endTime.value = ui.audioPreview.duration.toFixed(2);
        ui.dropZone.classList.add('hidden');
        ui.editorArea.classList.remove('hidden');
        ui.editorArea.classList.add('flex');
    };
}

async function loadFFmpeg() {
    if (ffmpeg) return ffmpeg;
    
    ffmpeg = new FFmpeg();
    ffmpeg.on('progress', ({ progress, time }) => {
        const percent = Math.min(Math.round(progress * 100), 100);
        
        if (progress > 1) {
             ui.progressBar.style.width = '100%';
             ui.progressText.textContent = `Processing Engine...`;
        } else {
             ui.progressBar.style.width = `${percent}%`;
             ui.progressText.textContent = `Cutting: ${percent}%...`;
        }
    });
    
    ui.progressText.textContent = "Loading Engine (first time only)...";
    
    await ffmpeg.load({
        coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js',
        wasmURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm'
    });
    
    return ffmpeg;
}

async function trimAudio() {
    if (!currentFile) return;
    
    const start = parseFloat(ui.startTime.value) || 0;
    const end = parseFloat(ui.endTime.value) || ui.audioPreview.duration;
    
    if (start >= end) {
        showToast("Start time must be less than end time.", "error");
        return;
    }
    
    ui.audioPreview.pause();
    
    ui.editorArea.classList.add('hidden');
    ui.editorArea.classList.remove('flex');
    ui.loader.classList.remove('hidden');
    ui.loader.classList.add('flex');
    ui.progressBar.style.width = '0%';
    ui.progressText.textContent = "Initializing...";

    try {
        const ff = await loadFFmpeg();
        const inputName = `input${fileExt}`;
        const outputName = `output${fileExt}`;
        
        await ff.writeFile(inputName, await fetchFile(currentFile));
        
        const cmd = [
            '-ss', start.toString(),
            '-i', inputName,
            '-t', (end - start).toString(),
            '-c', 'copy',
            outputName
        ];
        
        await ff.exec(cmd);
        
        const fileData = await ff.readFile(outputName);
        trimmedBlob = new Blob([fileData.buffer], { type: currentFile.type });
        
        ui.resultAudio.src = URL.createObjectURL(trimmedBlob);
        
        ui.loader.classList.add('hidden');
        ui.loader.classList.remove('flex');
        ui.resultArea.classList.remove('hidden');
        showToast('Audio cut successfully!');
        
    } catch (err) {
        console.error("FFmpeg Trim Error:", err);
        showToast('Error cutting audio.', 'error');
        resetUI();
    }
}

function resetUI() {
    currentFile = null;
    trimmedBlob = null;
    
    if (ui.audioPreview.src) {
        URL.revokeObjectURL(ui.audioPreview.src);
        ui.audioPreview.src = '';
    }
    if (ui.resultAudio.src) {
        URL.revokeObjectURL(ui.resultAudio.src);
        ui.resultAudio.src = '';
    }
    
    ui.editorArea.classList.add('hidden');
    ui.editorArea.classList.remove('flex');
    ui.resultArea.classList.add('hidden');
    ui.loader.classList.add('hidden');
    ui.loader.classList.remove('flex');
    ui.dropZone.classList.remove('hidden');
    ui.fileInput.value = '';
}
