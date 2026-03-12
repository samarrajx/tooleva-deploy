import { getEl, showToast } from '../../src/js/utils.js';

const ui = {
    input: getEl('text-input'),
    output: getEl('text-output'),
    btnRevAll: getEl('btn-rev-all'),
    btnRevWords: getEl('btn-rev-words'),
    btnRevChars: getEl('btn-rev-chars'),
    btnCopy: getEl('btn-copy'),
    btnClear: getEl('btn-clear')
};

ui.btnClear.addEventListener('click', () => {
    ui.input.value = '';
    ui.output.value = '';
    ui.input.focus();
});

ui.btnCopy.addEventListener('click', async () => {
    if (!ui.output.value) return;
    try {
        await navigator.clipboard.writeText(ui.output.value);
        showToast('Reversed text copied to clipboard!');
    } catch (err) {
        showToast('Failed to copy', 'error');
    }
});

ui.btnRevAll.addEventListener('click', () => {
    const text = ui.input.value;
    ui.output.value = text.split('').reverse().join('');
});

ui.btnRevWords.addEventListener('click', () => {
    const text = ui.input.value;
    // Split by spaces but preserve newlines
    ui.output.value = text.split('\n').map(line => {
        return line.split(' ').reverse().join(' ');
    }).join('\n');
});

ui.btnRevChars.addEventListener('click', () => {
    const text = ui.input.value;
    // Reverse characters within each word
    ui.output.value = text.split('\n').map(line => {
        return line.split(' ').map(word => {
            return word.split('').reverse().join('');
        }).join(' ');
    }).join('\n');
});

// Auto-trigger default reverse on typing
ui.input.addEventListener('input', () => {
    ui.output.value = ui.input.value.split('').reverse().join('');
});
