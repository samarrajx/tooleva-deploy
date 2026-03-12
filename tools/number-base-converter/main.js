import { getEl, showToast } from '../../src/js/utils.js';

const ui = {
    inputFrom: getEl('input-from'),
    inputTo: getEl('input-to'),
    selFrom: getEl('sel-from'),
    selTo: getEl('sel-to'),
    btnSwap: getEl('btn-swap'),
    btnCopy: getEl('btn-copy'),
    errorMsg: getEl('error-msg')
};

function convert() {
    const rawVal = ui.inputFrom.value.trim().toUpperCase();
    
    if (!rawVal) {
        ui.inputTo.value = '';
        ui.errorMsg.classList.add('hidden');
        ui.inputFrom.classList.remove('border-red-500');
        return;
    }

    const fromBase = parseInt(ui.selFrom.value);
    const toBase = parseInt(ui.selTo.value);

    // Validate characters based on base
    let isValid = true;
    if (fromBase === 2) isValid = /^[01]+$/.test(rawVal);
    if (fromBase === 8) isValid = /^[0-7]+$/.test(rawVal);
    if (fromBase === 10) isValid = /^[0-9]+$/.test(rawVal);
    if (fromBase === 16) isValid = /^[0-9A-F]+$/.test(rawVal);

    if (!isValid) {
        ui.inputTo.value = '';
        ui.errorMsg.classList.remove('hidden');
        ui.inputFrom.classList.add('border-red-500');
        return;
    }

    // Convert via decimal
    try {
        const decimalValue = parseInt(rawVal, fromBase);
        if (isNaN(decimalValue)) throw new Error('NaN');
        
        ui.inputTo.value = decimalValue.toString(toBase).toUpperCase();
        ui.errorMsg.classList.add('hidden');
        ui.inputFrom.classList.remove('border-red-500');
    } catch(err) {
        ui.inputTo.value = '';
        ui.errorMsg.classList.remove('hidden');
        ui.inputFrom.classList.add('border-red-500');
    }
}

ui.inputFrom.addEventListener('input', convert);
ui.selFrom.addEventListener('change', convert);
ui.selTo.addEventListener('change', convert);

ui.btnSwap.addEventListener('click', () => {
    const tempUnit = ui.selFrom.value;
    ui.selFrom.value = ui.selTo.value;
    ui.selTo.value = tempUnit;
    convert();
});

ui.btnCopy.addEventListener('click', async () => {
    if (!ui.inputTo.value) return;
    try {
        await navigator.clipboard.writeText(ui.inputTo.value);
        showToast('Result copied!');
    } catch(err) {
        showToast('Failed to copy', 'error');
    }
});

// Init
convert();
