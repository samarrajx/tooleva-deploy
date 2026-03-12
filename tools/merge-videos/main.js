import { fetchFile } from '@ffmpeg/util';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { initDropzone } from '../../src/js/dropzone.js';
import { downloadBlob, showToast, getEl } from '../../src/js/utils.js';

let file1 = null;
let file2 = null;
let mergedBlob = null;
let ffmpeg = null;

const ui = {
    drop1: getEl('drop-zone-1'),
    input1: getEl('file-input-1'),
    info1: getEl('file-info-1'),
    name1: getEl('file-name-1'),
    clear1: getEl('clear-1'),
    
    drop2: getEl('drop-zone-2'),
    input2: getEl('file-input-2'),
    info2: getEl('file-info-2'),
    name2: getEl('file-name-2'),
    clear2: getEl('clear-2'),
    
    editorArea: getEl('editor-area'),
    btnProcess: getEl('btn-process'),
    loader: getEl('loader'),
    progressText: getEl('progress-text'),
    progressBar: getEl('progress-bar'),
    resultArea: getEl('result-area'),
    btnDownload: getEl('btn-download'),
    btnRestart: getEl('btn-restart')
};

initDropzone('drop-zone-1', 'file-input-1', (f) => handleFileSelection(f, 1), { accept: 'video/*', multiple: false });
initDropzone('drop-zone-2', 'file-input-2', (f) => handleFileSelection(f, 2), { accept: 'video/*', multiple: false });

ui.clear1.addEventListener('click', () => clearFile(1));
ui.clear2.addEventListener('click', () => clearFile(2));
ui.btnRestart.addEventListener('click', resetUI);
ui.btnProcess.addEventListener('click', mergeVideos);

ui.btnDownload.addEventListener('click', () => {
    if (mergedBlob) {
        // use file1's name as base
        const baseName = file1 ? file1.name.replace(/\.[^/.]+$/, '') : 'video';
        downloadBlob(mergedBlob, `${baseName}-merged.mp4`);
    }
});

function handleFileSelection(files, slot) {
    const file = files[0];
    if (!file.type.startsWith('video/')) {
        showToast('Please upload a valid video.', 'error');
        return;
    }

    if (slot === 1) {
        file1 = file;
        ui.name1.textContent = file.name;
        ui.drop1.classList.add('hidden');
        ui.info1.classList.remove('hidden');
    } else {
        file2 = file;
        ui.name2.textContent = file.name;
        ui.drop2.classList.add('hidden');
        ui.info2.classList.remove('hidden');
    }
    
    checkReady();
}

function clearFile(slot) {
    if (slot === 1) {
        file1 = null;
        ui.input1.value = '';
        ui.info1.classList.add('hidden');
        ui.drop1.classList.remove('hidden');
    } else {
        file2 = null;
        ui.input2.value = '';
        ui.info2.classList.add('hidden');
        ui.drop2.classList.remove('hidden');
    }
    checkReady();
}

function checkReady() {
    if (file1 && file2) {
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
        // Concat progress isn't always accurate, but we'll try to represent it
        const percent = Math.min(Math.round(progress * 100), 100);
        ui.progressBar.style.width = `${percent}%`;
        ui.progressText.textContent = `Merging: ${percent}%...`;
    });
    
    ui.progressText.textContent = "Loading Engine (first time only)...";
    
    await ffmpeg.load({
        coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js',
        wasmURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm'
    });
    
    return ffmpeg;
}

async function mergeVideos() {
    if (!file1 || !file2) return;
    
    ui.editorArea.classList.add('hidden');
    ui.editorArea.classList.remove('flex');
    ui.loader.classList.remove('hidden');
    ui.loader.classList.add('flex');
    ui.progressBar.style.width = '0%';
    ui.progressText.textContent = "Initializing...";

    try {
        const ff = await loadFFmpeg();
        
        const ext1 = file1.name.substring(file1.name.lastIndexOf('.'));
        const ext2 = file2.name.substring(file2.name.lastIndexOf('.'));
        
        const in1 = `input1${ext1}`;
        const in2 = `input2${ext2}`;
        const out = 'merged.mp4';
        
        await ff.writeFile(in1, await fetchFile(file1));
        await ff.writeFile(in2, await fetchFile(file2));
        
        // Complex filter to normalize both videos to 720p (with padding if needed to maintain aspect ratio)
        // Then concat them visually and audibly.
        // Sets SAR to 1 to avoid mismatched SAR issues.
        const filter = `
            [0:v]scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,setsar=1[v0];
            [1:v]scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,setsar=1[v1];
            [v0][0:a][v1][1:a]concat=n=2:v=1:a=1[v][a]
        `.replace(/\s+/g, ''); // removing whitespace to keep console clean, though FFmpeg tolerates it
        
        const cmd = [
            '-i', in1,
            '-i', in2,
            '-filter_complex', filter,
            '-map', '[v]', '-map', '[a]',
            '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '28',
            out
        ];
        
        await ff.exec(cmd);
        
        const fileData = await ff.readFile(out);
        mergedBlob = new Blob([fileData.buffer], { type: 'video/mp4' });
        
        ui.loader.classList.add('hidden');
        ui.loader.classList.remove('flex');
        ui.resultArea.classList.remove('hidden');
        showToast('Videos merged successfully!');
        
    } catch (err) {
        console.error("FFmpeg Merge Error:", err);
        showToast('Error merging videos. They must have audio tracks to merge using this tool.', 'error');
        resetUI();
    }
}

function resetUI() {
    clearFile(1);
    clearFile(2);
    mergedBlob = null;
    
    ui.resultArea.classList.add('hidden');
    ui.loader.classList.add('hidden');
    ui.loader.classList.remove('flex');
}
