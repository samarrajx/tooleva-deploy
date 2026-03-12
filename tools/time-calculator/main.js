import { getEl, showToast } from '../../src/js/utils.js';

let op = 'add'; // 'add' or 'sub'

const ui = {
    t1h: getEl('t1-h'),
    t1m: getEl('t1-m'),
    t1s: getEl('t1-s'),
    
    t2h: getEl('t2-h'),
    t2m: getEl('t2-m'),
    t2s: getEl('t2-s'),
    
    btnAdd: getEl('btn-add'),
    btnSub: getEl('btn-sub'),
    
    btnCalc: getEl('btn-calculate'),
    btnReset: getEl('btn-reset'),
    
    resStr: getEl('result-str'),
    resDays: getEl('res-days'),
    resHrs: getEl('res-hrs'),
    resMins: getEl('res-mins'),
    resSecs: getEl('res-secs')
};

const activeClasses = ['text-primary-600', 'bg-primary-50', 'dark:bg-primary-900/40', 'dark:text-primary-400'];
const inactiveClasses = ['text-gray-500', 'hover:text-gray-700', 'dark:text-gray-400', 'dark:hover:text-gray-200', 'hover:bg-gray-50', 'dark:hover:bg-slate-700'];

ui.btnAdd.addEventListener('click', () => setMode('add'));
ui.btnSub.addEventListener('click', () => setMode('sub'));
ui.btnCalc.addEventListener('click', calculateTime);
ui.btnReset.addEventListener('click', resetForm);

// Allow Enter key to calc
[ui.t1h, ui.t1m, ui.t1s, ui.t2h, ui.t2m, ui.t2s].forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') calculateTime();
    });
});

function setMode(mode) {
    op = mode;
    if (mode === 'add') {
        ui.btnAdd.classList.add(...activeClasses);
        ui.btnAdd.classList.remove(...inactiveClasses);
        ui.btnSub.classList.remove(...activeClasses);
        ui.btnSub.classList.add(...inactiveClasses);
    } else {
        ui.btnSub.classList.add(...activeClasses);
        ui.btnSub.classList.remove(...inactiveClasses);
        ui.btnAdd.classList.remove(...activeClasses);
        ui.btnAdd.classList.add(...inactiveClasses);
    }
}

function parseInput(inputObj) {
    const val = parseInt(inputObj.value, 10);
    return isNaN(val) ? 0 : val;
}

function calculateTime() {
    const s1 = (parseInput(ui.t1h) * 3600) + (parseInput(ui.t1m) * 60) + parseInput(ui.t1s);
    const s2 = (parseInput(ui.t2h) * 3600) + (parseInput(ui.t2m) * 60) + parseInput(ui.t2s);
    
    let totalSecs = 0;
    
    if (op === 'add') {
        totalSecs = s1 + s2;
    } else {
        totalSecs = s1 - s2;
    }
    
    if (totalSecs < 0) {
         showToast('Result is negative. Please check your inputs.', 'error');
         totalSecs = 0; // Or display negative time? Let's just fix to 0 for simplicity or allow negative via Math.abs
         // We will allow negative time with a minus sign
    }
    
    updateDisplay(totalSecs);
}

function updateDisplay(totalSecs) {
    const isNeg = totalSecs < 0;
    const absSecs = Math.abs(totalSecs);
    
    const h = Math.floor(absSecs / 3600);
    const m = Math.floor((absSecs % 3600) / 60);
    const s = absSecs % 60;
    
    const sign = isNeg ? '-' : '';
    
    ui.resStr.textContent = `${sign}${h}h ${m}m ${s}s`;
    
    ui.resSecs.textContent = `${sign}${absSecs} seconds`;
    ui.resMins.textContent = `${sign}${(absSecs / 60).toFixed(2)} minutes`;
    ui.resHrs.textContent = `${sign}${(absSecs / 3600).toFixed(2)} hours`;
    ui.resDays.textContent = `${sign}${(absSecs / 86400).toFixed(2)} days`;
}

function resetForm() {
    [ui.t1h, ui.t1m, ui.t1s, ui.t2h, ui.t2m, ui.t2s].forEach(input => input.value = '');
    
    ui.resStr.textContent = '0h 0m 0s';
    ui.resSecs.textContent = '0 seconds';
    ui.resMins.textContent = '0 minutes';
    ui.resHrs.textContent = '0.00 hours';
    ui.resDays.textContent = '0.00 days';
}
