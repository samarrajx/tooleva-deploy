import { fetchFile } from '@ffmpeg/util';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { initDropzone } from '../../src/js/dropzone.js';
import { downloadBlob, showToast, getEl } from '../../src/js/utils.js';

let currentFile = null;
let gifBlob = null;
let ffmpeg = null;
let videoElement = document.createElement('video');

const ui = {
    dropZone: getEl('drop-zone'),
    fileInput: getEl('file-input'),
    editorArea: getEl('editor-area'),
    fileName: getEl('file-name'),
    fileDuration: getEl('file-duration'),
    btnRemove: getEl('btn-remove'),
    btnConvert: getEl('btn-convert'),
    gifFps: getEl('gif-fps'),
    gifScale: getEl('gif-scale'),
    loader: getEl('loader'),
    progressText: getEl('progress-text'),
    progressBar: getEl('progress-bar'),
    resultArea: getEl('result-area'),
    gifPreview: getEl('gif-preview'),
    btnDownload: getEl('btn-download'),
    btnRestart: getEl('btn-restart')
};

initDropzone('drop-zone', 'file-input', handleFileSelection, { accept: 'video/*', multiple: false });

ui.btnRemove.addEventListener('click', resetUI);
ui.btnRestart.addEventListener('click', resetUI);
ui.btnConvert.addEventListener('click', extractGif);

ui.btnDownload.addEventListener('click', () => {
    if (gifBlob && currentFile) {
        const baseName = currentFile.name.replace(/\.[^/.]+$/, '');
        downloadBlob(gifBlob, `${baseName}-animated.gif`);
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
    
    // Load metadata to check duration
    const url = URL.createObjectURL(file);
    videoElement.src = url;
    
    videoElement.onloadedmetadata = () => {
        ui.fileDuration.textContent = `${videoElement.duration.toFixed(1)} seconds`;
        
        if (videoElement.duration > 30) {
            showToast('Warning: High duration videos may crash your browser Tab during GIF conversion.', 'warning');
        }
        
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
        ui.progressBar.style.width = `${percent}%`;
        ui.progressText.textContent = `Encoding GIF: ${percent}%...`;
    });
    
    ui.progressText.textContent = "Loading Engine (first time only)...";
    
    await ffmpeg.load({
        coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js',
        wasmURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm'
    });
    
    return ffmpeg;
}

async function extractGif() {
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
        const outputName = 'output.gif';
        
        await ff.writeFile(inputName, await fetchFile(currentFile));
        
        const fps = ui.gifFps.value;
        const width = ui.gifScale.value;
        
        // Use a complex filter generating a high quality palette then mapping it.
        // It provides much better looking GIFs.
        const filter = `fps=${fps},scale=${width}:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`;
        
        const cmd = [
            '-i', inputName,
            '-vf', filter,
            outputName
        ];
        
        await ff.exec(cmd);
        
        const fileData = await ff.readFile(outputName);
        gifBlob = new Blob([fileData.buffer], { type: 'image/gif' });
        
        ui.gifPreview.src = URL.createObjectURL(gifBlob);
        
        ui.loader.classList.add('hidden');
        ui.loader.classList.remove('flex');
        ui.resultArea.classList.remove('hidden');
        showToast('GIF created successfully!');
        
    } catch (err) {
        console.error("FFmpeg GIF Error:", err);
        showToast('Error converting. Video may be too large.', 'error');
        resetUI();
    }
}

function resetUI() {
    currentFile = null;
    gifBlob = null;
    
    if (ui.gifPreview.src) {
        URL.revokeObjectURL(ui.gifPreview.src);
        ui.gifPreview.src = '';
    }
    
    ui.editorArea.classList.add('hidden');
    ui.editorArea.classList.remove('flex');
    ui.resultArea.classList.add('hidden');
    ui.loader.classList.add('hidden');
    ui.loader.classList.remove('flex');
    ui.dropZone.classList.remove('hidden');
    ui.fileInput.value = '';
}
