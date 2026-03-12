import { getEl, showToast } from '../../src/js/utils.js';

const ui = {
    input: getEl('text-input'),
    output: getEl('text-output'),
    chkDouble: getEl('chk-double'),
    chkTrim: getEl('chk-trim'),
    btnProcess: getEl('btn-process'),
    btnCopy: getEl('btn-copy'),
    btnClear: getEl('btn-clear'),
    
    statBefore: getEl('stat-before'),
    statAfter: getEl('stat-after'),
    statRemoved: getEl('stat-removed')
};

ui.btnProcess.addEventListener('click', processSpaces);

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
        showToast('Cleaned text copied to clipboard!');
    } catch (err) {
        showToast('Failed to copy', 'error');
    }
});

// Auto stats on paste/type
ui.input.addEventListener('input', () => {
    ui.statBefore.textContent = ui.input.value.length.toLocaleString();
});

function processSpaces() {
    const originalText = ui.input.value;
    if (!originalText) {
        ui.output.value = '';
        updateStats(0, 0, 0);
        return;
    }

    let resultText = originalText;

    if (ui.chkDouble.checked) {
        // Replace 2 or more spaces with a single space
        resultText = resultText.replace(/ {2,}/g, ' ');
    }

    if (ui.chkTrim.checked) {
        // Trim each line
        const lines = resultText.split('\n');
        for (let i = 0; i < lines.length; i++) {
            lines[i] = lines[i].trim();
        }
        resultText = lines.join('\n');
    }

    ui.output.value = resultText;
    
    const beforeLen = originalText.length;
    const afterLen = resultText.length;
    const removedCount = beforeLen - afterLen;
    
    updateStats(beforeLen, afterLen, removedCount);
}

function updateStats(before, after, removed) {
    ui.statBefore.textContent = before.toLocaleString();
    ui.statAfter.textContent = after.toLocaleString();
    ui.statRemoved.textContent = removed.toLocaleString();
}
