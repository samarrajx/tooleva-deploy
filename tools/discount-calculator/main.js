import { getEl, showToast } from '../../src/js/utils.js';

const ui = {
    price: getEl('original-price'),
    discount: getEl('discount-pct'),
    tax: getEl('tax-pct'),
    
    btnCalc: getEl('btn-calculate'),
    btnReset: getEl('btn-reset'),
    quickBtns: document.querySelectorAll('.quick-btn'),
    
    resFinal: getEl('result-final'),
    resOriginal: getEl('res-original'),
    resSaved: getEl('res-saved'),
    resAfterDisc: getEl('res-after-disc'),
    resTax: getEl('res-tax')
};

ui.btnCalc.addEventListener('click', calculateDiscount);
ui.btnReset.addEventListener('click', resetForm);

// Allow Enter key to calculate
[ui.price, ui.discount, ui.tax].forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') calculateDiscount();
    });
});

ui.quickBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        ui.discount.value = e.currentTarget.dataset.val;
        if (ui.price.value) calculateDiscount();
    });
});

function calculateDiscount() {
    const p = parseFloat(ui.price.value);
    const d = parseFloat(ui.discount.value) || 0;
    const t = parseFloat(ui.tax.value) || 0;
    
    if (isNaN(p) || p < 0) {
        showToast('Please enter a valid original price.', 'error');
        return;
    }
    
    if (d < 0 || d > 100) {
        showToast('Discount percentage must be between 0 and 100.', 'error');
        return;
    }

    const discountAmount = p * (d / 100);
    const priceAfterDiscount = p - discountAmount;
    const taxAmount = priceAfterDiscount * (t / 100);
    const finalPrice = priceAfterDiscount + taxAmount;
    
    updateDisplay(p, discountAmount, priceAfterDiscount, taxAmount, finalPrice);
}

function updateDisplay(original, saved, afterDisc, tax, final) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    
    ui.resOriginal.textContent = formatter.format(original);
    ui.resSaved.textContent = `-${formatter.format(saved)}`;
    ui.resAfterDisc.textContent = formatter.format(afterDisc);
    ui.resTax.textContent = `+${formatter.format(tax)}`;
    
    // Animate final price
    animateValue(ui.resFinal, parseFloat(ui.resFinal.textContent.replace(/[^0-9.-]+/g,"")) || 0, final, 500, formatter);
}

function resetForm() {
    ui.price.value = '';
    ui.discount.value = '';
    ui.tax.value = '';
    
    ui.resFinal.textContent = '$0.00';
    ui.resOriginal.textContent = '$0.00';
    ui.resSaved.textContent = '-$0.00';
    ui.resAfterDisc.textContent = '$0.00';
    ui.resTax.textContent = '+$0.00';
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
