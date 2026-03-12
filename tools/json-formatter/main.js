import { getEl, showToast } from '../../src/js/utils.js';

const ui = {
    input: getEl('json-input'),
    output: getEl('json-output'),
    btnFormat: getEl('btn-format'),
    btnMinify: getEl('btn-minify'),
    btnClear: getEl('btn-clear'),
    btnCopy: getEl('btn-copy'),
    selIndent: getEl('sel-indent'),
    errorBanner: getEl('error-banner'),
    errorMsg: getEl('error-msg')
};

function hideError() {
    ui.errorBanner.classList.add('hidden');
    ui.input.classList.remove('bg-red-50', 'dark:bg-red-900/10');
}

function showError(msg) {
    ui.errorMsg.textContent = msg;
    ui.errorBanner.classList.remove('hidden');
    ui.input.classList.add('bg-red-50', 'dark:bg-red-900/10');
    ui.output.value = '';
}

function processJson(action) {
    const raw = ui.input.value.trim();
    if (!raw) {
        hideError();
        ui.output.value = '';
        return;
    }

    try {
        const parsed = JSON.parse(raw);
        hideError();
        
        if (action === 'format') {
            const indent = parseInt(ui.selIndent.value) || 4;
            ui.output.value = JSON.stringify(parsed, null, indent);
        } else if (action === 'minify') {
            ui.output.value = JSON.stringify(parsed);
        }
    } catch (err) {
        showError(err.message || 'Invalid JSON format');
    }
}

ui.btnFormat.addEventListener('click', () => processJson('format'));
ui.btnMinify.addEventListener('click', () => processJson('minify'));
ui.selIndent.addEventListener('change', () => {
    if (ui.output.value && !ui.errorBanner.classList.contains('hidden') === false) {
        processJson('format');
    }
});

ui.btnClear.addEventListener('click', () => {
    ui.input.value = '';
    ui.output.value = '';
    hideError();
    ui.input.focus();
});

ui.btnCopy.addEventListener('click', async () => {
    if (!ui.output.value) return;
    try {
        await navigator.clipboard.writeText(ui.output.value);
        showToast('JSON copied to clipboard!');
    } catch (err) {
        showToast('Failed to copy', 'error');
    }
});

// Auto format on paste if desired, but user might paste huge JSONs. 
// Let's do a lightweight listener with debounce
let debounceTimer;
ui.input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        if (ui.input.value.trim().length > 0) {
            processJson('format');
        } else {
            hideError();
            ui.output.value = '';
        }
    }, 500); // Wait 500ms after last keystroke
});
