import { fetchFile } from '@ffmpeg/util';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { initDropzone } from '../../src/js/dropzone.js';
import { downloadBlob, showToast, getEl } from '../../src/js/utils.js';

let currentFile = null;
let compressedBlob = null;
let ffmpeg = null;

const ui = {
    dropZone: getEl('drop-zone'),
    fileInput: getEl('file-input'),
    editorArea: getEl('editor-area'),
    fileName: getEl('file-name'),
    fileSize: getEl('file-size'),
    btnRemove: getEl('btn-remove'),
    btnCompress: getEl('btn-compress'),
    compressionLevel: getEl('compression-level'),
    videoResolution: getEl('video-resolution'),
    loader: getEl('loader'),
    progressText: getEl('progress-text'),
    progressBar: getEl('progress-bar'),
    resultArea: getEl('result-area'),
    resultStats: getEl('result-stats'),
    btnDownload: getEl('btn-download'),
    btnRestart: getEl('btn-restart')
};

initDropzone('drop-zone', 'file-input', handleFileSelection, { accept: 'video/*', multiple: false });

ui.btnRemove.addEventListener('click', resetUI);
ui.btnRestart.addEventListener('click', resetUI);
ui.btnCompress.addEventListener('click', compressVideo);

ui.btnDownload.addEventListener('click', () => {
    if (compressedBlob && currentFile) {
        const baseName = currentFile.name.replace(/\.[^/.]+$/, '');
        downloadBlob(compressedBlob, `${baseName}-compressed.mp4`);
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
    if (!file.type.startsWith('video/')) {
        showToast('Please upload a valid video file.', 'error');
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
    
    // Use unpkg CDNs for wasm to avoid Vite packaging complexity if needed,
    // but default load should work if Vite serves them properly.
    await ffmpeg.load({
        coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js',
        wasmURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm'
    });
    
    return ffmpeg;
}

async function compressVideo() {
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
        
        const crf = ui.compressionLevel.value;
        const res = ui.videoResolution.value;
        
        let cmd = ['-i', inputName];
        
        if (res !== 'original') {
            const [w, h] = res.split('x');
            cmd.push('-vf', `scale=${w}:${h}`);
        }
        
        cmd.push('-vcodec', 'libx264', '-crf', crf, '-preset', 'ultrafast', outputName);
        
        await ff.exec(cmd);
        
        const fileData = await ff.readFile(outputName);
        compressedBlob = new Blob([fileData.buffer], { type: 'video/mp4' });
        
        // Compute stats
        const originalSize = formatBytes(currentFile.size);
        const newSize = formatBytes(compressedBlob.size);
        ui.resultStats.textContent = `Original: ${originalSize} ➔ New: ${newSize}`;
        
        ui.loader.classList.add('hidden');
        ui.loader.classList.remove('flex');
        ui.resultArea.classList.remove('hidden');
        showToast('Video processed successfully!');
        
    } catch (err) {
        console.error("FFmpeg Compression Error:", err);
        showToast('Error compressing video.', 'error');
        resetUI();
    }
}

function resetUI() {
    currentFile = null;
    compressedBlob = null;
    
    ui.editorArea.classList.add('hidden');
    ui.editorArea.classList.remove('flex');
    ui.resultArea.classList.add('hidden');
    ui.loader.classList.add('hidden');
    ui.loader.classList.remove('flex');
    ui.dropZone.classList.remove('hidden');
    ui.fileInput.value = '';
}
