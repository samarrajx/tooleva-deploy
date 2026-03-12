import { getEl, showToast } from '../../src/js/utils.js';

const ui = {
    input: getEl('text-input'),
    output: getEl('text-output'),
    btnClear: getEl('btn-clear'),
    btnCopy: getEl('btn-copy'),
    errorBanner: getEl('error-banner')
};

function decodeUrl() {
    let raw = ui.input.value.trim();
    if (!raw) {
        ui.output.value = '';
        ui.errorBanner.classList.add('hidden');
        return;
    }
    
    try {
        ui.output.value = decodeURIComponent(raw.replace(/\+/g,  " "));
        ui.errorBanner.classList.add('hidden');
    } catch (err) {
        ui.output.value = '';
        ui.errorBanner.classList.remove('hidden');
    }
}

// Support auto-decode
ui.input.addEventListener('input', decodeUrl);

ui.btnClear.addEventListener('click', () => {
    ui.input.value = '';
    ui.output.value = '';
    ui.errorBanner.classList.add('hidden');
    ui.input.focus();
});

ui.btnCopy.addEventListener('click', async () => {
    if (!ui.output.value) return;
    try {
        await navigator.clipboard.writeText(ui.output.value);
        showToast('Decoded text copied!');
    } catch (err) {
        showToast('Failed to copy', 'error');
    }
});
