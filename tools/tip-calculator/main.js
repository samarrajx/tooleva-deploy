import { getEl } from '../../src/js/utils.js';

const ui = {
    bill: getEl('bill-amount'),
    slider: getEl('tip-slider'),
    inputTip: getEl('tip-input'),
    quickTips: document.querySelectorAll('.quick-tip'),
    people: getEl('people-amount'),
    btnMinus: getEl('btn-minus'),
    btnPlus: getEl('btn-plus'),
    btnReset: getEl('btn-reset'),
    
    resTotalPp: getEl('res-total-pp'),
    resTipPp: getEl('res-tip-pp'),
    resTotalTip: getEl('res-total-tip'),
    resTotalBill: getEl('res-total-bill')
};

// Sync Slider and Input
ui.slider.addEventListener('input', (e) => {
    ui.inputTip.value = e.target.value;
    updateQuickTipUI(e.target.value);
    calculateTip();
});

ui.inputTip.addEventListener('input', (e) => {
    let val = parseFloat(e.target.value) || 0;
    if (val > 100) val = 100;
    if (val < 0) val = 0;
    ui.slider.value = val;
    updateQuickTipUI(val);
    calculateTip();
});

ui.bill.addEventListener('input', calculateTip);
ui.people.addEventListener('input', () => {
    let p = parseInt(ui.people.value) || 1;
    if (p < 1) {
        p = 1;
        ui.people.value = p;
    }
    calculateTip();
});

ui.btnMinus.addEventListener('click', () => {
    let p = parseInt(ui.people.value) || 1;
    if (p > 1) p--;
    ui.people.value = p;
    calculateTip();
});

ui.btnPlus.addEventListener('click', () => {
    let p = parseInt(ui.people.value) || 1;
    p++;
    ui.people.value = p;
    calculateTip();
});

ui.quickTips.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const val = e.currentTarget.dataset.val;
        ui.inputTip.value = val;
        ui.slider.value = val;
        updateQuickTipUI(val);
        calculateTip();
    });
});

ui.btnReset.addEventListener('click', () => {
    ui.bill.value = '';
    ui.slider.value = '15';
    ui.inputTip.value = '15';
    ui.people.value = '1';
    updateQuickTipUI('15');
    calculateTip();
});

function updateQuickTipUI(val) {
    ui.quickTips.forEach(btn => {
        if (btn.dataset.val == val) {
            btn.classList.add('ring-2', 'ring-primary-500');
        } else {
            btn.classList.remove('ring-2', 'ring-primary-500');
        }
    });
}

function calculateTip() {
    const billAmount = parseFloat(ui.bill.value) || 0;
    const tipPct = parseFloat(ui.inputTip.value) || 0;
    const people = parseInt(ui.people.value) || 1;
    
    const totalTip = billAmount * (tipPct / 100);
    const totalBill = billAmount + totalTip;
    
    const tipPerPerson = totalTip / people;
    const totalPerPerson = totalBill / people;
    
    updateDisplay(totalTip, totalBill, tipPerPerson, totalPerPerson);
}

function updateDisplay(totalTip, totalBill, tipPp, totalPp) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    
    ui.resTotalTip.textContent = formatter.format(totalTip);
    ui.resTotalBill.textContent = formatter.format(totalBill);
    ui.resTipPp.textContent = formatter.format(tipPp);
    ui.resTotalPp.textContent = formatter.format(totalPp);
}
