import { getEl } from '../../src/js/utils.js';

// Type 1: P% of X
const t1p = getEl('t1-p');
const t1x = getEl('t1-x');
const t1res = getEl('t1-res');

function calcT1() {
    const p = parseFloat(t1p.value);
    const x = parseFloat(t1x.value);
    if (!isNaN(p) && !isNaN(x)) {
        t1res.textContent = parseFloat(((p / 100) * x).toFixed(4));
    } else {
        t1res.textContent = '?';
    }
}
t1p.addEventListener('input', calcT1);
t1x.addEventListener('input', calcT1);

// Type 2: X is what percent of Y
const t2x = getEl('t2-x');
const t2y = getEl('t2-y');
const t2res = getEl('t2-res');

function calcT2() {
    const x = parseFloat(t2x.value);
    const y = parseFloat(t2y.value);
    if (!isNaN(x) && !isNaN(y) && y !== 0) {
        t2res.textContent = parseFloat(((x / y) * 100).toFixed(4)) + '%';
    } else {
        t2res.textContent = '?';
    }
}
t2x.addEventListener('input', calcT2);
t2y.addEventListener('input', calcT2);

// Type 3: % Increase/Decrease
const t3x = getEl('t3-x');
const t3y = getEl('t3-y');
const t3res = getEl('t3-res');

function calcT3() {
    const x = parseFloat(t3x.value);
    const y = parseFloat(t3y.value);
    if (!isNaN(x) && !isNaN(y) && x !== 0) {
        const increase = (y - x) / Math.abs(x) * 100;
        const prefix = increase > 0 ? '+' : '';
        t3res.textContent = prefix + parseFloat(increase.toFixed(4)) + '%';
        
        if (increase > 0) {
            t3res.classList.remove('text-red-500', 'text-primary-600');
            t3res.classList.add('text-green-600');
        } else if (increase < 0) {
            t3res.classList.remove('text-green-600', 'text-primary-600');
            t3res.classList.add('text-red-500');
        } else {
            t3res.classList.remove('text-red-500', 'text-green-600');
            t3res.classList.add('text-primary-600');
        }
    } else {
        t3res.textContent = '?';
        t3res.className = 'text-3xl font-bold text-primary-600';
    }
}
t3x.addEventListener('input', calcT3);
t3y.addEventListener('input', calcT3);
