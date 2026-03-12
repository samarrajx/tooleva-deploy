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

// Conversion rates to square meters (base unit)
const rates = {
    'sqm': 1,
    'sqkm': 1000000,
    'ha': 10000,
    'acre': 4046.85642,
    'sqmi': 2589988.11,
    'sqyd': 0.83612736,
    'sqft': 0.09290304,
    'sqin': 0.00064516
};

const unitNames = {
    'sqm': 'Square Meters',
    'sqkm': 'Square Kilometers',
    'ha': 'Hectares',
    'acre': 'Acres',
    'sqmi': 'Square Miles',
    'sqyd': 'Square Yards',
    'sqft': 'Square Feet',
    'sqin': 'Square Inches'
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

    const inSqm = val * rates[fromKey];
    const result = inSqm / rates[toKey];
    
    ui.inputTo.value = parseFloat(result.toFixed(6));

    const rateCalc = rates[fromKey] / rates[toKey];
    ui.formulaText.textContent = `Multiply the area value by ${parseFloat(rateCalc.toFixed(6))} to convert from ${unitNames[fromKey]} to ${unitNames[toKey]}.`;
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
