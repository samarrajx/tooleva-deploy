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

function convert() {
    const val = parseFloat(ui.inputFrom.value);
    
    if (isNaN(val)) {
        ui.inputTo.value = '';
        ui.formulaText.textContent = '';
        return;
    }

    const fromKey = ui.selFrom.value;
    const toKey = ui.selTo.value;

    let inCelsius = 0;
    let result = 0;
    let formula = '';

    // Convert from custom to Celsius
    if (fromKey === 'C') {
        inCelsius = val;
    } else if (fromKey === 'F') {
        inCelsius = (val - 32) * (5/9);
    } else if (fromKey === 'K') {
        inCelsius = val - 273.15;
    }

    // Convert from Celsius to custom
    if (toKey === 'C') {
        result = inCelsius;
        if(fromKey === 'F') formula = `(${val}°F - 32) × 5/9 = ${result.toFixed(2)}°C`;
        else if(fromKey === 'K') formula = `${val}K - 273.15 = ${result.toFixed(2)}°C`;
        else formula = 'Same unit';
    } else if (toKey === 'F') {
        result = (inCelsius * 1.8) + 32;
        if(fromKey === 'C') formula = `(${val}°C × 9/5) + 32 = ${result.toFixed(2)}°F`;
        else if(fromKey === 'K') formula = `(${val}K - 273.15) × 9/5 + 32 = ${result.toFixed(2)}°F`;
        else formula = 'Same unit';
    } else if (toKey === 'K') {
        result = inCelsius + 273.15;
        if(fromKey === 'C') formula = `${val}°C + 273.15 = ${result.toFixed(2)}K`;
        else if(fromKey === 'F') formula = `(${val}°F - 32) × 5/9 + 273.15 = ${result.toFixed(2)}K`;
        else formula = 'Same unit';
    }
    
    ui.inputTo.value = parseFloat(result.toFixed(4));
    ui.formulaText.textContent = formula;
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
