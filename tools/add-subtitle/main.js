import { fetchFile } from '@ffmpeg/util';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { initDropzone } from '../../src/js/dropzone.js';
import { downloadBlob, showToast, getEl } from '../../src/js/utils.js';

let videoFile = null;
let subFile = null;
let subbedBlob = null;
let ffmpeg = null;

const ui = {
    dropVideo: getEl('drop-zone-video'),
    inputVideo: getEl('file-input-video'),
    infoVideo: getEl('file-info-video'),
    nameVideo: getEl('file-name-video'),
    clearVideo: getEl('clear-video'),
    
    dropSub: getEl('drop-zone-sub'),
    inputSub: getEl('file-input-sub'),
    infoSub: getEl('file-info-sub'),
    nameSub: getEl('file-name-sub'),
    clearSub: getEl('clear-sub'),
    
    editorArea: getEl('editor-area'),
    btnProcess: getEl('btn-process'),
    loader: getEl('loader'),
    progressText: getEl('progress-text'),
    progressBar: getEl('progress-bar'),
    resultArea: getEl('result-area'),
    btnDownload: getEl('btn-download'),
    btnRestart: getEl('btn-restart')
};

initDropzone('drop-zone-video', 'file-input-video', (f) => handleFileSelection(f, 'video'), { accept: 'video/mp4', multiple: false });
initDropzone('drop-zone-sub', 'file-input-sub', (f) => handleFileSelection(f, 'sub'), { accept: '.srt,.vtt,text/plain', multiple: false });

ui.clearVideo.addEventListener('click', () => clearFile('video'));
ui.clearSub.addEventListener('click', () => clearFile('sub'));
ui.btnRestart.addEventListener('click', resetUI);
ui.btnProcess.addEventListener('click', addSubtitles);

ui.btnDownload.addEventListener('click', () => {
    if (subbedBlob) {
        const baseName = videoFile ? videoFile.name.replace(/\.[^/.]+$/, '') : 'video';
        downloadBlob(subbedBlob, `${baseName}-subbed.mp4`);
    }
});

function handleFileSelection(files, type) {
    const file = files[0];

    if (type === 'video') {
        if (!file.type.includes('mp4') && !file.name.toLowerCase().endsWith('.mp4')) {
            showToast('Please upload an MP4 video file.', 'error');
            return;
        }
        videoFile = file;
        ui.nameVideo.textContent = file.name;
        ui.dropVideo.classList.add('hidden');
        ui.infoVideo.classList.remove('hidden');
    } else {
        if (!file.name.toLowerCase().endsWith('.srt') && !file.name.toLowerCase().endsWith('.vtt')) {
            showToast('Please upload a valid .srt or .vtt file.', 'error');
            return;
        }
        subFile = file;
        ui.nameSub.textContent = file.name;
        ui.dropSub.classList.add('hidden');
        ui.infoSub.classList.remove('hidden');
    }
    
    checkReady();
}

function clearFile(type) {
    if (type === 'video') {
        videoFile = null;
        ui.inputVideo.value = '';
        ui.infoVideo.classList.add('hidden');
        ui.dropVideo.classList.remove('hidden');
    } else {
        subFile = null;
        ui.inputSub.value = '';
        ui.infoSub.classList.add('hidden');
        ui.dropSub.classList.remove('hidden');
    }
    checkReady();
}

function checkReady() {
    if (videoFile && subFile) {
        ui.editorArea.classList.remove('hidden');
        ui.editorArea.classList.add('flex');
    } else {
        ui.editorArea.classList.add('hidden');
        ui.editorArea.classList.remove('flex');
    }
}

async function loadFFmpeg() {
    if (ffmpeg) return ffmpeg;
    
    ffmpeg = new FFmpeg();
    ffmpeg.on('progress', ({ progress, time }) => {
        const percent = Math.min(Math.round(progress * 100), 100);
        ui.progressBar.style.width = `${percent}%`;
        ui.progressText.textContent = `Multiplexing: ${percent}%...`;
    });
    
    ui.progressText.textContent = "Loading Engine (first time only)...";
    
    await ffmpeg.load({
        coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js',
        wasmURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm'
    });
    
    return ffmpeg;
}

async function addSubtitles() {
    if (!videoFile || !subFile) return;
    
    ui.editorArea.classList.add('hidden');
    ui.editorArea.classList.remove('flex');
    ui.loader.classList.remove('hidden');
    ui.loader.classList.add('flex');
    ui.progressBar.style.width = '0%';
    ui.progressText.textContent = "Initializing...";

    try {
        const ff = await loadFFmpeg();
        
        const inVideo = `input_vid.mp4`;
        const extSub = subFile.name.substring(subFile.name.lastIndexOf('.'));
        const inSub = `input_sub${extSub}`;
        const out = 'output.mp4';
        
        await ff.writeFile(inVideo, await fetchFile(videoFile));
        await ff.writeFile(inSub, await fetchFile(subFile));
        
        // Add soft subtitles as a mov_text stream to MP4 container. Very fast.
        const cmd = [
            '-i', inVideo,
            '-i', inSub,
            '-c', 'copy',          // Copy video/audio, no re-encode
            '-c:s', 'mov_text',    // Encode subtitle to mp4 compatible format
            '-map', '0',           // Map all streams from input 0
            '-map', '1',           // Map all streams from input 1
            out
        ];
        
        await ff.exec(cmd);
        
        const fileData = await ff.readFile(out);
        subbedBlob = new Blob([fileData.buffer], { type: 'video/mp4' });
        
        ui.loader.classList.add('hidden');
        ui.loader.classList.remove('flex');
        ui.resultArea.classList.remove('hidden');
        showToast('Subtitles added successfully!');
        
    } catch (err) {
        console.error("FFmpeg Subtitle Error:", err);
        showToast('Error adding subtitles to video.', 'error');
        resetUI();
    }
}

function resetUI() {
    clearFile('video');
    clearFile('sub');
    subbedBlob = null;
    
    ui.resultArea.classList.add('hidden');
    ui.loader.classList.add('hidden');
    ui.loader.classList.remove('flex');
}
