import { getEl, showToast } from '../../src/js/utils.js';

const ui = {
    cost: getEl('cost-price'),
    sell: getEl('sell-price'),
    
    btnCalc: getEl('btn-calculate'),
    btnReset: getEl('btn-reset'),
    
    resMargin: getEl('res-margin'),
    resProfit: getEl('res-profit'),
    resMarkup: getEl('res-markup')
};

ui.btnCalc.addEventListener('click', calculateProfit);
ui.btnReset.addEventListener('click', resetForm);

// Allow Enter key to calc
[ui.cost, ui.sell].forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') calculateProfit();
    });
});

function calculateProfit() {
    const c = parseFloat(ui.cost.value);
    const s = parseFloat(ui.sell.value);
    
    if (isNaN(c) || c < 0) {
        showToast('Please enter a valid cost price.', 'error');
        return;
    }
    if (isNaN(s) || s < 0) {
        showToast('Please enter a valid selling price.', 'error');
        return;
    }
    
    const profit = s - c;
    
    let margin = 0;
    if (s > 0) {
        margin = (profit / s) * 100;
    }
    
    let markup = 0;
    if (c > 0) {
        markup = (profit / c) * 100;
    }
    
    updateDisplay(profit, margin, markup);
}

function updateDisplay(profit, margin, markup) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    
    ui.resProfit.textContent = formatter.format(profit);
    
    if (margin < 0) {
        ui.resMargin.classList.add('text-red-600', 'dark:text-red-400');
        ui.resMargin.classList.remove('text-emerald-600', 'dark:text-emerald-400');
    } else {
        ui.resMargin.classList.remove('text-red-600', 'dark:text-red-400');
        ui.resMargin.classList.add('text-emerald-600', 'dark:text-emerald-400');
    }
    
    ui.resMargin.textContent = `${margin.toFixed(2)}%`;
    ui.resMarkup.textContent = `${markup.toFixed(2)}%`;
}

function resetForm() {
    ui.cost.value = '';
    ui.sell.value = '';
    
    ui.resProfit.textContent = '$0.00';
    ui.resMargin.textContent = '0.00%';
    ui.resMarkup.textContent = '0.00%';
    
    ui.resMargin.classList.remove('text-red-600', 'dark:text-red-400');
    ui.resMargin.classList.add('text-emerald-600', 'dark:text-emerald-400');
}
