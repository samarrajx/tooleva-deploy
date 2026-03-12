import { getEl } from '../../src/js/utils.js';

const ui = {
    screenDisplay: getEl('calc-display'),
    screenExp: getEl('calc-exp'),
    btnDeg: getEl('btn-deg'),
    btnRad: getEl('btn-rad'),
    btnClear: getEl('btn-clear'),
    btnEquals: getEl('btn-equals'),
    keys: document.querySelectorAll('.calc-btn[data-val]')
};

let currentExpression = '';
let evaluated = false;
let angleMode = 'rad'; // 'rad' or 'deg'

// Math.js configuration for angles
const replacementConfig = {
    sin: (x) => angleMode === 'deg' ? math.sin(math.unit(x, 'deg')) : math.sin(x),
    cos: (x) => angleMode === 'deg' ? math.cos(math.unit(x, 'deg')) : math.cos(x),
    tan: (x) => angleMode === 'deg' ? math.tan(math.unit(x, 'deg')) : math.tan(x),
    asin: (x) => angleMode === 'deg' ? math.evaluate(`asin(${x}) / pi * 180`) : math.asin(x),
    acos: (x) => angleMode === 'deg' ? math.evaluate(`acos(${x}) / pi * 180`) : math.acos(x),
    atan: (x) => angleMode === 'deg' ? math.evaluate(`atan(${x}) / pi * 180`) : math.atan(x)
};

// Toggle angles
ui.btnDeg.addEventListener('click', () => {
    angleMode = 'deg';
    ui.btnDeg.classList.remove('opacity-50');
    ui.btnRad.classList.add('opacity-50');
});

ui.btnRad.addEventListener('click', () => {
    angleMode = 'rad';
    ui.btnRad.classList.remove('opacity-50');
    ui.btnDeg.classList.add('opacity-50');
});

// Keys
ui.keys.forEach(key => {
    key.addEventListener('click', (e) => {
        const val = e.currentTarget.dataset.val;
        handleInput(val);
    });
});

ui.btnClear.addEventListener('click', () => {
    currentExpression = '';
    ui.screenExp.value = '';
    updateScreen();
});

ui.btnEquals.addEventListener('click', evaluateExpression);

// Basic Keyboard support
document.addEventListener('keydown', (e) => {
    const key = e.key;
    if (/[0-9]/.test(key) || ['+', '-', '*', '/', '(', ')', '.', '^', '%'].includes(key)) {
        handleInput(key);
    } else if (key === 'Enter' || key === '=') {
        evaluateExpression();
    } else if (key === 'Backspace') {
        if (evaluated) {
            currentExpression = '';
        } else {
            currentExpression = currentExpression.slice(0, -1);
        }
        updateScreen();
    } else if (key === 'Escape') {
        currentExpression = '';
        ui.screenExp.value = '';
        updateScreen();
    }
});

function handleInput(val) {
    if (evaluated) {
        // If clicking a number after eval, start fresh
        if (/[0-9]/.test(val) || /[a-z]/.test(val) || val === '(' || val === 'pi' || val === 'e') {
            currentExpression = val;
        } else {
            // Keep previous answer and append operator
            currentExpression = ui.screenDisplay.value + val;
        }
        evaluated = false;
        ui.screenExp.value = '';
    } else {
        currentExpression += val;
    }
    updateScreen();
}

function updateScreen() {
    ui.screenDisplay.value = currentExpression || '0';
    // auto scroll to right
    ui.screenDisplay.scrollLeft = ui.screenDisplay.scrollWidth;
}

function evaluateExpression() {
    if (!currentExpression) return;
    
    try {
        ui.screenExp.value = currentExpression + ' =';
        
        // Custom math scope for Angle overrides if needed
        let scope = {};
        let result;
        
        if (angleMode === 'deg') {
            const tempMath = math.create(math.all);
            tempMath.import(replacementConfig, { override: true });
            result = tempMath.evaluate(currentExpression, scope);
        } else {
            result = math.evaluate(currentExpression, scope);
        }

        // Format tiny floating point errors (e.g., 0.1 + 0.2)
        if (typeof result === 'number') {
            result = parseFloat(result.toPrecision(14)).toString();
        }

        currentExpression = String(result);
        ui.screenDisplay.value = currentExpression;
        evaluated = true;
    } catch (e) {
        ui.screenDisplay.value = "Error";
        console.error("Math eval error", e);
        evaluated = true;
    }
}
