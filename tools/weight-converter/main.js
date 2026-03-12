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

// Conversion rates to grams (base unit)
const rates = {
    'mg': 0.001,
    'g': 1,
    'kg': 1000,
    'mt': 1000000,
    'oz': 28.349523125,
    'lb': 453.59237,
    'st': 6350.29318
};

const unitNames = {
    'mg': 'Milligrams',
    'g': 'Grams',
    'kg': 'Kilograms',
    'mt': 'Metric Tons',
    'oz': 'Ounces',
    'lb': 'Pounds',
    'st': 'Stones'
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

    const inGrams = val * rates[fromKey];
    const result = inGrams / rates[toKey];
    
    ui.inputTo.value = parseFloat(result.toFixed(6));

    const rateCalc = rates[fromKey] / rates[toKey];
    ui.formulaText.textContent = `Multiply the weight value by ${parseFloat(rateCalc.toFixed(6))} to convert from ${unitNames[fromKey]} to ${unitNames[toKey]}.`;
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
