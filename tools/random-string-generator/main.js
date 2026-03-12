import { getEl, showToast } from '../../src/js/utils.js';

const ui = {
    output: getEl('string-output'),
    btnCopy: getEl('btn-copy'),
    btnGen: getEl('btn-generate'),
    sliderVal: getEl('length-val'),
    sliderLength: getEl('slider-length'),
    chkUpper: getEl('chk-uppercase'),
    chkLower: getEl('chk-lowercase'),
    chkNum: getEl('chk-numbers'),
    chkSym: getEl('chk-symbols')
};

const CHARPOOL = {
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    num: '0123456789',
    sym: '!@#$%^&*()_+~`|}{[]:;?><,./-='
};

function generateString() {
    const len = parseInt(ui.sliderLength.value);
    ui.sliderVal.textContent = len;

    const hasUpper = ui.chkUpper.checked;
    const hasLower = ui.chkLower.checked;
    const hasNum = ui.chkNum.checked;
    const hasSym = ui.chkSym.checked;

    if (!hasUpper && !hasLower && !hasNum && !hasSym) {
        ui.chkLower.checked = true;
        return generateString();
    }

    let pool = '';
    
    if (hasUpper) pool += CHARPOOL.upper;
    if (hasLower) pool += CHARPOOL.lower;
    if (hasNum) pool += CHARPOOL.num;
    if (hasSym) pool += CHARPOOL.sym;

    let result = '';
    const poolLen = pool.length;

    // Secure randomization
    const randomBuffer = new Uint32Array(len);
    window.crypto.getRandomValues(randomBuffer);

    for (let i = 0; i < len; i++) {
        result += pool[randomBuffer[i] % poolLen];
    }
    
    ui.output.value = result;
    
    // Auto adjust textarea height
    ui.output.style.height = 'auto';
    ui.output.style.height = ui.output.scrollHeight + 'px';
}

// Events
ui.btnGen.addEventListener('click', generateString);
ui.sliderLength.addEventListener('input', generateString);
[ui.chkUpper, ui.chkLower, ui.chkNum, ui.chkSym].forEach(el => el.addEventListener('change', generateString));

ui.btnCopy.addEventListener('click', async () => {
    if (!ui.output.value) return;
    try {
        await navigator.clipboard.writeText(ui.output.value);
        showToast('String copied to clipboard!');
    } catch (err) {
        showToast('Failed to copy', 'error');
    }
});

// Init
generateString();
