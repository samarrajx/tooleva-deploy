import { getEl, showToast } from '../../src/js/utils.js';

const ui = {
    input: getEl('text-input'),
    output: getEl('text-output'),
    btnClear: getEl('btn-clear'),
    btnCopy: getEl('btn-copy')
};

function encodeUrl() {
    const raw = ui.input.value;
    if (!raw) {
        ui.output.value = '';
        return;
    }
    
    try {
        ui.output.value = encodeURIComponent(raw);
    } catch (err) {
        ui.output.value = 'Error encoding URL';
    }
}

ui.input.addEventListener('input', encodeUrl);

ui.btnClear.addEventListener('click', () => {
    ui.input.value = '';
    ui.output.value = '';
    ui.input.focus();
});

ui.btnCopy.addEventListener('click', async () => {
    if (!ui.output.value) return;
    try {
        await navigator.clipboard.writeText(ui.output.value);
        showToast('Encoded text copied!');
    } catch (err) {
        showToast('Failed to copy', 'error');
    }
});
