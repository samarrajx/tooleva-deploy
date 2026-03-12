import { getEl, showToast } from '../../src/js/utils.js';

const ui = {
    input: getEl('text-input'),
    output: getEl('text-output'),
    chkCase: getEl('chk-case'),
    chkEmpty: getEl('chk-empty'),
    btnProcess: getEl('btn-process'),
    btnCopy: getEl('btn-copy'),
    btnClear: getEl('btn-clear'),
    
    statOriginal: getEl('stat-original'),
    statNew: getEl('stat-new'),
    statRemoved: getEl('stat-removed')
};

ui.btnProcess.addEventListener('click', processLines);

ui.btnClear.addEventListener('click', () => {
    ui.input.value = '';
    ui.output.value = '';
    updateStats(0, 0, 0);
    ui.input.focus();
});

ui.btnCopy.addEventListener('click', async () => {
    if (!ui.output.value) return;
    try {
        await navigator.clipboard.writeText(ui.output.value);
        showToast('Cleaned list copied to clipboard!');
    } catch (err) {
        showToast('Failed to copy', 'error');
    }
});

// Auto stats on paste/type
ui.input.addEventListener('input', () => {
    const lines = ui.input.value.split('\n');
    ui.statOriginal.textContent = ui.input.value === '' ? 0 : lines.length.toLocaleString();
});

function processLines() {
    if (!ui.input.value) {
        ui.output.value = '';
        updateStats(0, 0, 0);
        return;
    }

    const lines = ui.input.value.split('\n');
    const originalCount = lines.length;
    
    const isCaseSens = ui.chkCase.checked;
    const isRemovingEmpty = ui.chkEmpty.checked;
    
    const seen = new Set();
    const result = [];
    let removedCount = 0;
    
    for (let line of lines) {
        if (isRemovingEmpty && line.trim() === '') {
            removedCount++; // Empty line deleted
            continue;
        }
        
        const compareLine = isCaseSens ? line : line.toLowerCase();
        
        if (!seen.has(compareLine)) {
            seen.add(compareLine);
            result.push(line);
        } else {
            removedCount++; // Duplicate
        }
    }
    
    ui.output.value = result.join('\n');
    updateStats(originalCount, result.length, removedCount);
}

function updateStats(orig, nw, rem) {
    ui.statOriginal.textContent = orig.toLocaleString();
    ui.statNew.textContent = nw.toLocaleString();
    ui.statRemoved.textContent = rem.toLocaleString();
}
