import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
import { initDropzone } from '../../src/js/dropzone.js';
import { downloadBlob, showToast, getEl } from '../../src/js/utils.js';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

let currentFile = null;
let csvBlob = null;

const ui = {
    dropZone: getEl('drop-zone'),
    fileInfo: getEl('file-info'),
    fileName: getEl('file-name'),
    btnRemove: getEl('btn-remove'),
    btnProcess: getEl('btn-process'),
    loader: getEl('loader'),
    progressText: getEl('progress-text'),
    resultArea: getEl('result-area'),
    btnDownload: getEl('btn-download'),
    btnRestart: getEl('btn-restart')
};

initDropzone('drop-zone', 'file-input', handleFileSelection, { accept: '.pdf', multiple: false });

ui.btnRemove.addEventListener('click', resetUI);
ui.btnRestart.addEventListener('click', resetUI);
ui.btnProcess.addEventListener('click', processPdf);
ui.btnDownload.addEventListener('click', () => {
    if (csvBlob && currentFile) {
        const baseName = currentFile.name.replace(/\.pdf$/i, '');
        downloadBlob(csvBlob, `${baseName}-data.csv`);
    }
});

function handleFileSelection(files) {
    const file = files[0];
    if (file.type !== 'application/pdf') return;

    currentFile = file;
    ui.fileName.textContent = file.name;
    
    ui.dropZone.classList.add('hidden');
    ui.fileInfo.classList.remove('hidden');
    ui.fileInfo.classList.add('flex');
}

function resetUI() {
    currentFile = null;
    csvBlob = null;
    ui.fileInfo.classList.add('hidden');
    ui.fileInfo.classList.remove('flex');
    ui.resultArea.classList.add('hidden');
    ui.loader.classList.add('hidden');
    ui.loader.classList.remove('flex');
    ui.dropZone.classList.remove('hidden');
}

async function processPdf() {
    if (!currentFile) return;
    ui.fileInfo.classList.add('hidden');
    ui.fileInfo.classList.remove('flex');
    ui.loader.classList.remove('hidden');
    ui.loader.classList.add('flex');
    ui.progressText.textContent = "Analyzing layout...";

    try {
        const arrayBuffer = await currentFile.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
        const pdf = await loadingTask.promise;
        const numPages = pdf.numPages;
        
        let csvContent = "";

        for (let i = 1; i <= numPages; i++) {
            ui.progressText.textContent = `Processing table data on page ${i}...`;
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            
            // Basic heuristic to align text rows based on Y coordinates
            const rows = {};
            
            textContent.items.forEach(item => {
                const y = Math.round(item.transform[5] / 5) * 5; // Group items by approx Y position
                if (!rows[y]) rows[y] = [];
                rows[y].push(item);
            });
            
            // Sort rows top to bottom
            const sortedYs = Object.keys(rows).sort((a, b) => parseFloat(b) - parseFloat(a));
            
            sortedYs.forEach(y => {
                const rowItems = rows[y];
                // Sort left to right
                rowItems.sort((a, b) => a.transform[4] - b.transform[4]);
                
                // Escape and quote columns
                const rowStr = rowItems
                    .map(it => `"${it.str.replace(/"/g, '""')}"`)
                    .join(',');
                    
                if (rowStr.trim()) {
                    csvContent += rowStr + "\n";
                }
            });
            
            csvContent += "\n"; // Separate pages slightly
        }

        // BOM for Excel
        const bom = "\uFEFF";
        csvBlob = new Blob([bom + csvContent], {
            type: 'text/csv;charset=utf-8'
        });

        ui.loader.classList.add('hidden');
        ui.loader.classList.remove('flex');
        ui.resultArea.classList.remove('hidden');
        showToast('Extracted to Excel format successfully!');
    } catch (error) {
        console.error("PDF to Excel Error:", error);
        showToast('Error extracting data. Documents heavily reliant on images cannot be parsed.', 'error');
        ui.fileInfo.classList.remove('hidden');
        ui.fileInfo.classList.add('flex');
        ui.loader.classList.add('hidden');
        ui.loader.classList.remove('flex');
    }
}
