import { getEl, showToast } from '../../src/js/utils.js';

const ui = {
    inputFrom: getEl('input-from'),
    inputTo: getEl('input-to'),
    selFrom: getEl('sel-from'),
    selTo: getEl('sel-to'),
    btnSwap: getEl('btn-swap'),
    btnCopy: getEl('btn-copy'),
    formulaText: getEl('formula-text'),
    loader: getEl('loader')
};

let exchangeRates = {};
let baseCurrency = 'USD';

async function fetchRates() {
    try {
        const res = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await res.json();
        
        exchangeRates = data.rates;
        
        const currencies = Object.keys(exchangeRates);
        
        let html = '';
        currencies.forEach(c => {
            html += `<option value="${c}">${c}</option>`;
        });

        ui.selFrom.innerHTML = html;
        ui.selTo.innerHTML = html;

        // Set defaults
        ui.selFrom.value = 'USD';
        ui.selTo.value = 'EUR';

        ui.loader.classList.add('hidden');
        convert();
        
    } catch(err) {
        ui.formulaText.textContent = "Error: Failed to fetch live exchange rates.";
        ui.loader.classList.add('hidden');
    }
}

function convert() {
    if (Object.keys(exchangeRates).length === 0) return;

    const val = parseFloat(ui.inputFrom.value);
    
    if (isNaN(val)) {
        ui.inputTo.value = '';
        ui.formulaText.textContent = '';
        return;
    }

    const fromKey = ui.selFrom.value;
    const toKey = ui.selTo.value;

    // Convert to USD first
    const inUSD = val / exchangeRates[fromKey];
    
    // Convert from USD to Target
    const result = inUSD * exchangeRates[toKey];
    
    ui.inputTo.value = parseFloat(result.toFixed(4));

    const rateCalc = (1 / exchangeRates[fromKey]) * exchangeRates[toKey];
    ui.formulaText.textContent = `1 ${fromKey} = ${parseFloat(rateCalc.toFixed(4))} ${toKey} (Live rates via Open Exchange)`;
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
fetchRates();
