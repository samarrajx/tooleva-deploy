import { getEl, showToast } from '../../src/js/utils.js';

const ui = {
    amount: getEl('loan-amount'),
    rate: getEl('interest-rate'),
    tenure: getEl('loan-tenure'),
    tenureType: getEl('tenure-type'),
    btnCalc: getEl('btn-calculate'),
    btnReset: getEl('btn-reset'),
    resEmi: getEl('result-emi'),
    resInterest: getEl('result-interest'),
    resTotal: getEl('result-total')
};

ui.btnCalc.addEventListener('click', calculateEMI);
ui.btnReset.addEventListener('click', resetForm);

// Allow Enter key to calculate
[ui.amount, ui.rate, ui.tenure].forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') calculateEMI();
    });
});

function calculateEMI() {
    const p = parseFloat(ui.amount.value);
    const r = parseFloat(ui.rate.value);
    const t = parseFloat(ui.tenure.value);
    const type = ui.tenureType.value;
    
    if (isNaN(p) || p <= 0) {
        showToast('Please enter a valid loan amount.', 'error');
        return;
    }
    if (isNaN(r) || r < 0) {
        showToast('Please enter a valid interest rate.', 'error');
        return;
    }
    if (isNaN(t) || t <= 0) {
        showToast('Please enter a valid loan tenure.', 'error');
        return;
    }

    // EMI Formula: P * r * (1+r)^n / ((1+r)^n - 1)
    // where P = Principal, r = monthly interest rate (annual / 12 / 100), n = total months
    
    let months = type === 'years' ? parseInt(t * 12, 10) : parseInt(t, 10);
    let monthlyRate = r / 12 / 100;
    let emi = 0;
    
    if (r === 0) {
        emi = p / months;
    } else {
        const x = Math.pow(1 + monthlyRate, months);
        emi = (p * monthlyRate * x) / (x - 1);
    }
    
    const totalPayment = emi * months;
    const totalInterest = totalPayment - p;
    
    // Format currency
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    // Animate numbers
    animateValue(ui.resEmi, 0, emi, 500, formatter);
    animateValue(ui.resInterest, 0, totalInterest, 500, formatter);
    animateValue(ui.resTotal, 0, totalPayment, 500, formatter);
}

function resetForm() {
    ui.amount.value = '';
    ui.rate.value = '';
    ui.tenure.value = '';
    ui.tenureType.value = 'years';
    
    ui.resEmi.textContent = '$0.00';
    ui.resInterest.textContent = '$0.00';
    ui.resTotal.textContent = '$0.00';
}

function animateValue(obj, start, end, duration, formatter) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // Easing out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = start + easeOut * (end - start);
        
        obj.textContent = formatter.format(current);
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            obj.textContent = formatter.format(end);
        }
    };
    window.requestAnimationFrame(step);
}
