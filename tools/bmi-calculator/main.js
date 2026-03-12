import { getEl, showToast } from '../../src/js/utils.js';

let unitMode = 'metric';

const ui = {
    btnMetric: getEl('btn-metric'),
    btnImperial: getEl('btn-imperial'),
    metricGroup: getEl('metric-inputs'),
    imperialGroup: getEl('imperial-inputs'),
    
    hCm: getEl('height-cm'),
    wKg: getEl('weight-kg'),
    
    hFt: getEl('height-ft'),
    hIn: getEl('height-in'),
    wLb: getEl('weight-lb'),
    
    btnCalc: getEl('btn-calculate'),
    btnReset: getEl('btn-reset'),
    
    resBmi: getEl('result-bmi'),
    resBadge: getEl('result-badge'),
    resBg: getEl('result-bg')
};

// Switch active styling classes for toggle
const activeClasses = ['text-primary-600', 'dark:text-primary-400', 'bg-white', 'dark:bg-slate-700', 'shadow-sm', 'border-gray-200', 'dark:border-slate-600'];
const inactiveClasses = ['text-gray-500', 'hover:text-gray-700', 'dark:text-gray-400', 'dark:hover:text-gray-200', 'border-transparent', 'hover:bg-gray-50', 'dark:hover:bg-slate-800/50'];

ui.btnMetric.addEventListener('click', () => setMode('metric'));
ui.btnImperial.addEventListener('click', () => setMode('imperial'));

ui.btnCalc.addEventListener('click', calculateBMI);
ui.btnReset.addEventListener('click', resetForm);

// Allow Enter key to calculate
[ui.hCm, ui.wKg, ui.hFt, ui.hIn, ui.wLb].forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') calculateBMI();
    });
});

function setMode(mode) {
    unitMode = mode;
    if (mode === 'metric') {
        ui.metricGroup.classList.remove('hidden');
        ui.legacyGroup = ui.imperialGroup.classList.add('hidden');
        
        ui.btnMetric.classList.add(...activeClasses);
        ui.btnMetric.classList.remove(...inactiveClasses);
        ui.btnImperial.classList.remove(...activeClasses);
        ui.btnImperial.classList.add(...inactiveClasses);
    } else {
        ui.imperialGroup.classList.remove('hidden');
        ui.legacyGroup = ui.metricGroup.classList.add('hidden');
        
        ui.btnImperial.classList.add(...activeClasses);
        ui.btnImperial.classList.remove(...inactiveClasses);
        ui.btnMetric.classList.remove(...activeClasses);
        ui.btnMetric.classList.add(...inactiveClasses);
    }
}

function calculateBMI() {
    let bmi = 0;
    
    if (unitMode === 'metric') {
        const heightM = parseFloat(ui.hCm.value) / 100;
        const weight = parseFloat(ui.wKg.value);
        
        if (isNaN(heightM) || heightM <= 0 || isNaN(weight) || weight <= 0) {
            showToast('Please enter valid height and weight values.', 'error');
            return;
        }
        bmi = weight / (heightM * heightM);
    } else {
        const hFt = parseFloat(ui.hFt.value) || 0;
        const hIn = parseFloat(ui.hIn.value) || 0;
        const weight = parseFloat(ui.wLb.value);
        
        const totalInches = (hFt * 12) + hIn;
        
        if (totalInches <= 0 || isNaN(weight) || weight <= 0) {
            showToast('Please enter valid height and weight values.', 'error');
            return;
        }
        
        bmi = (weight / (totalInches * totalInches)) * 703;
    }
    
    displayResult(bmi);
}

function displayResult(bmi) {
    ui.resBmi.textContent = bmi.toFixed(1);
    
    // Clear previous color classes
    ui.resBmi.className = 'text-5xl md:text-6xl font-extrabold transition-colors duration-500';
    ui.resBadge.className = 'inline-block px-4 py-2 rounded-full text-sm font-bold transition-colors duration-500';
    ui.resBg.className = 'absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-16 -mt-16 transition-colors duration-500 pointer-events-none';
    
    if (bmi < 18.5) {
        ui.resBmi.classList.add('text-blue-600', 'dark:text-blue-400');
        ui.resBadge.classList.add('bg-blue-100', 'text-blue-800', 'dark:bg-blue-900/30', 'dark:text-blue-300');
        ui.resBadge.textContent = 'Underweight';
        ui.resBg.classList.add('bg-blue-200', 'dark:bg-blue-900/30');
    } else if (bmi >= 18.5 && bmi <= 24.9) {
        ui.resBmi.classList.add('text-green-600', 'dark:text-green-400');
        ui.resBadge.classList.add('bg-green-100', 'text-green-800', 'dark:bg-green-900/30', 'dark:text-green-300');
        ui.resBadge.textContent = 'Normal weight';
        ui.resBg.classList.add('bg-green-200', 'dark:bg-green-900/30');
    } else if (bmi >= 25 && bmi <= 29.9) {
        ui.resBmi.classList.add('text-yellow-600', 'dark:text-yellow-400');
        ui.resBadge.classList.add('bg-yellow-100', 'text-yellow-800', 'dark:bg-yellow-900/30', 'dark:text-yellow-300');
        ui.resBadge.textContent = 'Overweight';
        ui.resBg.classList.add('bg-yellow-200', 'dark:bg-yellow-900/30');
    } else {
        ui.resBmi.classList.add('text-red-600', 'dark:text-red-400');
        ui.resBadge.classList.add('bg-red-100', 'text-red-800', 'dark:bg-red-900/30', 'dark:text-red-300');
        ui.resBadge.textContent = 'Obesity';
        ui.resBg.classList.add('bg-red-200', 'dark:bg-red-900/30');
    }
}

function resetForm() {
    ui.hCm.value = '';
    ui.wKg.value = '';
    ui.hFt.value = '';
    ui.hIn.value = '';
    ui.wLb.value = '';
    
    ui.resBmi.textContent = '0.0';
    ui.resBmi.className = 'text-5xl md:text-6xl font-extrabold text-gray-800 dark:text-white transition-colors duration-500';
    
    ui.resBadge.textContent = 'Waiting for input...';
    ui.resBadge.className = 'inline-block px-4 py-2 rounded-full text-sm font-bold bg-gray-200 text-gray-700 dark:bg-slate-800 dark:text-gray-300 transition-colors duration-500';
    
    ui.resBg.className = 'absolute top-0 right-0 w-32 h-32 bg-gray-200 dark:bg-slate-700/50 rounded-full blur-3xl -mr-16 -mt-16 transition-colors duration-500 pointer-events-none';
}
