import { fetchFile } from '@ffmpeg/util';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { initDropzone } from '../../src/js/dropzone.js';
import { downloadBlob, showToast, getEl } from '../../src/js/utils.js';

let currentFile = null;
let trimmedBlob = null;
let ffmpeg = null;

const ui = {
    dropZone: getEl('drop-zone'),
    fileInput: getEl('file-input'),
    editorArea: getEl('editor-area'),
    videoPreview: getEl('video-preview'),
    startTime: getEl('start-time'),
    endTime: getEl('end-time'),
    btnSetStart: getEl('btn-set-start'),
    btnSetEnd: getEl('btn-set-end'),
    btnTrim: getEl('btn-trim'),
    loader: getEl('loader'),
    progressText: getEl('progress-text'),
    progressBar: getEl('progress-bar'),
    resultArea: getEl('result-area'),
    btnDownload: getEl('btn-download'),
    btnRestart: getEl('btn-restart')
};

initDropzone('drop-zone', 'file-input', handleFileSelection, { accept: 'video/*', multiple: false });

ui.btnSetStart.addEventListener('click', () => {
    ui.startTime.value = ui.videoPreview.currentTime.toFixed(2);
});

ui.btnSetEnd.addEventListener('click', () => {
    ui.endTime.value = ui.videoPreview.currentTime.toFixed(2);
});

ui.btnRestart.addEventListener('click', resetUI);
ui.btnTrim.addEventListener('click', trimVideo);

ui.btnDownload.addEventListener('click', () => {
    if (trimmedBlob && currentFile) {
        const baseName = currentFile.name.replace(/\.[^/.]+$/, '');
        downloadBlob(trimmedBlob, `${baseName}-trimmed.mp4`);
    }
});

function handleFileSelection(files) {
    const file = files[0];
    if (!file.type.startsWith('video/')) {
        showToast('Please upload a valid video.', 'error');
        return;
    }

    currentFile = file;
    
    const url = URL.createObjectURL(file);
    ui.videoPreview.src = url;
    
    ui.videoPreview.onloadedmetadata = () => {
        ui.endTime.value = ui.videoPreview.duration.toFixed(2);
        ui.dropZone.classList.add('hidden');
        ui.editorArea.classList.remove('hidden');
        ui.editorArea.classList.add('flex');
    };
}

async function loadFFmpeg() {
    if (ffmpeg) return ffmpeg;
    
    ffmpeg = new FFmpeg();
    ffmpeg.on('progress', ({ progress, time }) => {
        // progress can be inaccurate during trimming, fallback to standard %
        const percent = Math.min(Math.round(progress * 100), 100);
        
        // Sometimes progress comes as time during trim instead of 0-1 ratio
        if (progress > 1) {
             ui.progressBar.style.width = '100%';
             ui.progressText.textContent = `Processing Engine...`;
        } else {
             ui.progressBar.style.width = `${percent}%`;
             ui.progressText.textContent = `Trimming: ${percent}%...`;
        }
    });
    
    ui.progressText.textContent = "Loading Engine (first time only)...";
    
    await ffmpeg.load({
        coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js',
        wasmURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm'
    });
    
    return ffmpeg;
}

async function trimVideo() {
    if (!currentFile) return;
    
    const start = parseFloat(ui.startTime.value) || 0;
    const end = parseFloat(ui.endTime.value) || ui.videoPreview.duration;
    
    if (start >= end) {
        showToast("Start time must be less than end time.", "error");
        return;
    }
    
    // Pause video to free resources
    ui.videoPreview.pause();
    
    ui.editorArea.classList.add('hidden');
    ui.editorArea.classList.remove('flex');
    ui.loader.classList.remove('hidden');
    ui.loader.classList.add('flex');
    ui.progressBar.style.width = '0%';
    ui.progressText.textContent = "Initializing...";

    try {
        const ff = await loadFFmpeg();
        const inputName = 'input' + currentFile.name.substring(currentFile.name.lastIndexOf('.'));
        const outputName = 'output.mp4';
        
        await ff.writeFile(inputName, await fetchFile(currentFile));
        
        // Fast seek using -ss before input avoids decoding entire video start
        const cmd = [
            '-ss', start.toString(),
            '-i', inputName,
            '-t', (end - start).toString(),
            '-c:v', 'copy', '-c:a', 'copy', 
            outputName
        ];
        
        await ff.exec(cmd);
        
        const fileData = await ff.readFile(outputName);
        trimmedBlob = new Blob([fileData.buffer], { type: 'video/mp4' });
        
        ui.loader.classList.add('hidden');
        ui.loader.classList.remove('flex');
        ui.resultArea.classList.remove('hidden');
        showToast('Video trimmed successfully!');
        
    } catch (err) {
        console.error("FFmpeg Trim Error:", err);
        showToast('Error trimming video. The format may require re-encoding.', 'error');
        resetUI();
    }
}

function resetUI() {
    currentFile = null;
    trimmedBlob = null;
    
    if (ui.videoPreview.src) {
        URL.revokeObjectURL(ui.videoPreview.src);
        ui.videoPreview.src = '';
    }
    
    ui.editorArea.classList.add('hidden');
    ui.editorArea.classList.remove('flex');
    ui.resultArea.classList.add('hidden');
    ui.loader.classList.add('hidden');
    ui.loader.classList.remove('flex');
    ui.dropZone.classList.remove('hidden');
    ui.fileInput.value = '';
}
