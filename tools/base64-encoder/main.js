import { getEl, showToast } from '../../src/js/utils.js';

const ui = {
    input: getEl('text-input'),
    output: getEl('text-output'),
    btnClear: getEl('btn-clear'),
    btnCopy: getEl('btn-copy')
};

function encodeBase64() {
    const raw = ui.input.value;
    if (!raw) {
        ui.output.value = '';
        return;
    }
    
    try {
        // Handle utf-8 string encoding correctly before base64
        const textEncoder = new TextEncoder();
        const bytes = textEncoder.encode(raw);
        const binString = String.fromCodePoint(...bytes);
        ui.output.value = btoa(binString);
    } catch (err) {
        ui.output.value = 'Error encoding to Base64';
    }
}

ui.input.addEventListener('input', encodeBase64);

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
