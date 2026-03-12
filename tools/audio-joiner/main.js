import { fetchFile } from '@ffmpeg/util';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { initDropzone } from '../../src/js/dropzone.js';
import { downloadBlob, showToast, getEl } from '../../src/js/utils.js';

let file1 = null;
let file2 = null;
let joinedBlob = null;
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
    audioPreview: getEl('audio-preview'),
    btnDownload: getEl('btn-download'),
    btnRestart: getEl('btn-restart')
};

initDropzone('drop-zone-1', 'file-input-1', (f) => handleFileSelection(f, 1), { accept: 'audio/*', multiple: false });
initDropzone('drop-zone-2', 'file-input-2', (f) => handleFileSelection(f, 2), { accept: 'audio/*', multiple: false });

ui.clear1.addEventListener('click', () => clearFile(1));
ui.clear2.addEventListener('click', () => clearFile(2));
ui.btnRestart.addEventListener('click', resetUI);
ui.btnProcess.addEventListener('click', joinAudio);

ui.btnDownload.addEventListener('click', () => {
    if (joinedBlob) {
        downloadBlob(joinedBlob, `joined-audio.mp3`);
    }
});

function handleFileSelection(files, slot) {
    const file = files[0];
    if (!file.type.startsWith('audio/')) {
        showToast('Please upload a valid audio file.', 'error');
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
        const percent = Math.min(Math.round(progress * 100), 100);
        ui.progressBar.style.width = `${percent}%`;
        ui.progressText.textContent = `Joining: ${percent}%...`;
    });
    
    ui.progressText.textContent = "Loading Engine (first time only)...";
    
    await ffmpeg.load({
        coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js',
        wasmURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm'
    });
    
    return ffmpeg;
}

async function joinAudio() {
    if (!file1 || !file2) return;
    
    ui.editorArea.classList.add('hidden');
    ui.editorArea.classList.remove('flex');
    ui.loader.classList.remove('hidden');
    ui.loader.classList.add('flex');
    ui.progressBar.style.width = '0%';
    ui.progressText.textContent = "Initializing...";

    try {
        const ff = await loadFFmpeg();
        
        const in1 = 'input1' + file1.name.substring(file1.name.lastIndexOf('.'));
        const in2 = 'input2' + file2.name.substring(file2.name.lastIndexOf('.'));
        const out = 'joined.mp3';
        
        await ff.writeFile(in1, await fetchFile(file1));
        await ff.writeFile(in2, await fetchFile(file2));
        
        const filter = `[0:a][1:a]concat=n=2:v=0:a=1[a]`;
        
        const cmd = [
            '-i', in1,
            '-i', in2,
            '-filter_complex', filter,
            '-map', '[a]',
            '-c:a', 'libmp3lame',
            '-q:a', '2',
            out
        ];
        
        await ff.exec(cmd);
        
        const fileData = await ff.readFile(out);
        joinedBlob = new Blob([fileData.buffer], { type: 'audio/mpeg' });
        
        ui.audioPreview.src = URL.createObjectURL(joinedBlob);
        
        ui.loader.classList.add('hidden');
        ui.loader.classList.remove('flex');
        ui.resultArea.classList.remove('hidden');
        showToast('Audio files joined successfully!');
        
    } catch (err) {
        console.error("FFmpeg Audio Join Error:", err);
        showToast('Error joining audio files. Formats might be incompatible.', 'error');
        resetUI();
    }
}

function resetUI() {
    clearFile(1);
    clearFile(2);
    joinedBlob = null;
    
    if (ui.audioPreview.src) {
        URL.revokeObjectURL(ui.audioPreview.src);
        ui.audioPreview.src = '';
    }
    
    ui.resultArea.classList.add('hidden');
    ui.loader.classList.add('hidden');
    ui.loader.classList.remove('flex');
}
