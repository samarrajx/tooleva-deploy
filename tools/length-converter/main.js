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

// Conversion rates to meters (base unit)
const rates = {
    'mm': 0.001,
    'cm': 0.01,
    'm': 1,
    'km': 1000,
    'in': 0.0254,
    'ft': 0.3048,
    'yd': 0.9144,
    'mi': 1609.344,
    'nmi': 1852
};

const unitNames = {
    'mm': 'Millimeters',
    'cm': 'Centimeters',
    'm': 'Meters',
    'km': 'Kilometers',
    'in': 'Inches',
    'ft': 'Feet',
    'yd': 'Yards',
    'mi': 'Miles',
    'nmi': 'Nautical Miles'
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

    // Convert 'from' to meters
    const inMeters = val * rates[fromKey];
    
    // Convert meters to 'to'
    const result = inMeters / rates[toKey];
    
    // Format output (handle floating point display gracefully)
    // Up to 6 decimals max, remove trailing zeroes
    ui.inputTo.value = parseFloat(result.toFixed(6));

    // Update formula text
    const rateCalc = rates[fromKey] / rates[toKey];
    ui.formulaText.textContent = `Multiply the length value by ${parseFloat(rateCalc.toFixed(6))} to convert from ${unitNames[fromKey]} to ${unitNames[toKey]}.`;
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
