import { getEl, showToast } from '../../src/js/utils.js';

const ui = {
    input: getEl('text-input'),
    btnAz: getEl('btn-az'),
    btnZa: getEl('btn-za'),
    btnLength: getEl('btn-length'),
    btnRandom: getEl('btn-random'),
    btnReverse: getEl('btn-reverse'),
    btnCopy: getEl('btn-copy'),
    btnClear: getEl('btn-clear')
};

ui.btnClear.addEventListener('click', () => {
    ui.input.value = '';
    ui.input.focus();
});

ui.btnCopy.addEventListener('click', async () => {
    if (!ui.input.value) return;
    try {
        await navigator.clipboard.writeText(ui.input.value);
        showToast('Sorted text copied to clipboard!');
    } catch (err) {
        showToast('Failed to copy', 'error');
    }
});

function getLines() {
    return ui.input.value.split('\n');
}

function setLines(lines) {
    ui.input.value = lines.join('\n');
}

ui.btnAz.addEventListener('click', () => {
    const lines = getLines();
    lines.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
    setLines(lines);
});

ui.btnZa.addEventListener('click', () => {
    const lines = getLines();
    lines.sort((a, b) => b.localeCompare(a, undefined, { sensitivity: 'base' }));
    setLines(lines);
});

ui.btnLength.addEventListener('click', () => {
    const lines = getLines();
    lines.sort((a, b) => a.length - b.length || a.localeCompare(b));
    setLines(lines);
});

ui.btnReverse.addEventListener('click', () => {
    const lines = getLines();
    lines.reverse();
    setLines(lines);
});

ui.btnRandom.addEventListener('click', () => {
    const lines = getLines();
    // Fisher-Yates shuffle
    for (let i = lines.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [lines[i], lines[j]] = [lines[j], lines[i]];
    }
    setLines(lines);
});
