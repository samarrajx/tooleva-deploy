import { fetchFile } from '@ffmpeg/util';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { initDropzone } from '../../src/js/dropzone.js';
import { downloadBlob, showToast, getEl } from '../../src/js/utils.js';

let currentFile = null;
let rotatedBlob = null;
let ffmpeg = null;
let rotationMode = 'transpose=1'; // default: 90 right

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
    btnDownload: getEl('btn-download'),
    btnRestart: getEl('btn-restart'),
    presets: document.querySelectorAll('.rotation-preset')
};

initDropzone('drop-zone', 'file-input', handleFileSelection, { accept: 'video/*', multiple: false });

ui.btnRemove.addEventListener('click', resetUI);
ui.btnRestart.addEventListener('click', resetUI);
ui.btnProcess.addEventListener('click', rotateVideo);

ui.presets.forEach(btn => {
    btn.addEventListener('click', (e) => {
        ui.presets.forEach(b => b.classList.remove('border-primary-500', 'shadow-sm'));
        e.currentTarget.classList.add('border-primary-500', 'shadow-sm');
        
        const val = e.currentTarget.dataset.rotate;
        if (val === '1,1') {
            rotationMode = 'transpose=1,transpose=1'; // 180 degrees
        } else {
            rotationMode = `transpose=${val}`;
        }
    });
});

ui.btnDownload.addEventListener('click', () => {
    if (rotatedBlob && currentFile) {
        const baseName = currentFile.name.replace(/\.[^/.]+$/, '');
        downloadBlob(rotatedBlob, `${baseName}-rotated.mp4`);
    }
});

function handleFileSelection(files) {
    const file = files[0];
    if (!file.type.startsWith('video/')) {
        showToast('Please upload a valid video file.', 'error');
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

async function rotateVideo() {
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
        const outputName = 'output.mp4';
        
        await ff.writeFile(inputName, await fetchFile(currentFile));
        
        // Transpose filter re-encodes video. Using ultrafast for browser performance.
        const cmd = [
            '-i', inputName,
            '-vf', rotationMode,
            '-c:a', 'copy',
            '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '26',
            outputName
        ];
        
        await ff.exec(cmd);
        
        const fileData = await ff.readFile(outputName);
        rotatedBlob = new Blob([fileData.buffer], { type: 'video/mp4' });
        
        ui.loader.classList.add('hidden');
        ui.loader.classList.remove('flex');
        ui.resultArea.classList.remove('hidden');
        showToast('Video rotated successfully!');
        
    } catch (err) {
        console.error("FFmpeg Rotation Error:", err);
        showToast('Error rotating video.', 'error');
        resetUI();
    }
}

function resetUI() {
    currentFile = null;
    rotatedBlob = null;
    
    ui.editorArea.classList.add('hidden');
    ui.editorArea.classList.remove('flex');
    ui.resultArea.classList.add('hidden');
    ui.loader.classList.add('hidden');
    ui.loader.classList.remove('flex');
    ui.dropZone.classList.remove('hidden');
    ui.fileInput.value = '';
}
