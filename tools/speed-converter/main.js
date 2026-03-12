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

// Conversion rates to meters per second (base unit)
const rates = {
    'ms': 1,
    'kmh': 0.277778, // 1000m / 3600s
    'mph': 0.44704,  // 1609.344m / 3600s
    'knot': 0.514444, // 1852m / 3600s
    'fts': 0.3048   // 1 ft is 0.3048m
};

const unitNames = {
    'ms': 'm/s',
    'kmh': 'km/h',
    'mph': 'mph',
    'knot': 'knots',
    'fts': 'ft/s'
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

    const inMs = val * rates[fromKey];
    const result = inMs / rates[toKey];
    
    ui.inputTo.value = parseFloat(result.toFixed(6));

    const rateCalc = rates[fromKey] / rates[toKey];
    ui.formulaText.textContent = `Multiply the speed value by ${parseFloat(rateCalc.toFixed(6))} to convert from ${unitNames[fromKey]} to ${unitNames[toKey]}.`;
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
