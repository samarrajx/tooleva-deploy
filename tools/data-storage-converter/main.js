import { getEl, showToast } from '../../src/js/utils.js';

const ui = {
    inputFrom: getEl('input-from'),
    inputTo: getEl('input-to'),
    selFrom: getEl('sel-from'),
    selTo: getEl('sel-to'),
    btnSwap: getEl('btn-swap'),
    btnCopy: getEl('btn-copy'),
    formulaText: getEl('formula-text')
};

// Rates in Bytes (Base 2 -> 1024)
const rates = {
    'b': 1 / 8,             // 8 bits = 1 Byte
    'B': 1,
    'KB': 1024,
    'MB': Math.pow(1024, 2),
    'GB': Math.pow(1024, 3),
    'TB': Math.pow(1024, 4),
    'PB': Math.pow(1024, 5)
};

const unitNames = {
    'b': 'Bits',
    'B': 'Bytes',
    'KB': 'Kilobytes',
    'MB': 'Megabytes',
    'GB': 'Gigabytes',
    'TB': 'Terabytes',
    'PB': 'Petabytes'
};

function convert() {
    const val = parseFloat(ui.inputFrom.value);
    
    if (isNaN(val)) {
        ui.inputTo.value = '';
        ui.formulaText.textContent = '';
        return;
    }

    const fromKey = ui.selFrom.value;
    const toKey = ui.selTo.value;

    const inBytes = val * rates[fromKey];
    const result = inBytes / rates[toKey];
    
    ui.inputTo.value = parseFloat(result.toFixed(6));

    const rateCalc = rates[fromKey] / rates[toKey];
    ui.formulaText.textContent = `Multiply the value by ${parseFloat(rateCalc.toFixed(8))} to convert from ${unitNames[fromKey]} to ${unitNames[toKey]}.`;
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
