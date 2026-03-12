import { getEl, showToast } from '../../src/js/utils.js';

const ui = {
    output: getEl('password-output'),
    btnCopy: getEl('btn-copy'),
    btnGen: getEl('btn-generate'),
    sliderVal: getEl('length-val'),
    sliderLength: getEl('slider-length'),
    chkUpper: getEl('chk-uppercase'),
    chkLower: getEl('chk-lowercase'),
    chkNum: getEl('chk-numbers'),
    chkSym: getEl('chk-symbols'),
    strBar: getEl('strength-bar'),
    strText: getEl('strength-text')
};

const CHARS = {
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    num: '0123456789',
    sym: '!@#$%^&*()_+~`|}{[]:;?><,./-='
};

function checkStrength(len, hasUpper, hasLower, hasNum, hasSym) {
    let score = 0;
    if (len > 8) score += 1;
    if (len > 12) score += 1;
    if (len >= 16) score += 1;

    let types = hasUpper + hasLower + hasNum + hasSym;
    score += (types - 1); // Up to 3 points for types

    if (score < 2) return { text: 'Weak', class: 'bg-red-500 text-red-500', w: '25%' };
    if (score < 4) return { text: 'Medium', class: 'bg-yellow-500 text-yellow-500', w: '50%' };
    if (score < 6) return { text: 'Strong', class: 'bg-emerald-500 text-emerald-500', w: '75%' };
    return { text: 'Very Strong', class: 'bg-purple-500 text-purple-500', w: '100%' };
}

function generatePassword() {
    const len = parseInt(ui.sliderLength.value);
    ui.sliderVal.textContent = len;

    const hasUpper = ui.chkUpper.checked;
    const hasLower = ui.chkLower.checked;
    const hasNum = ui.chkNum.checked;
    const hasSym = ui.chkSym.checked;

    if (!hasUpper && !hasLower && !hasNum && !hasSym) {
        ui.chkLower.checked = true;
        return generatePassword();
    }

    let rawPool = '';
    let mandatory = [];
    
    // Secure randomization function
    const getRandomChar = (str) => {
        const arr = new Uint32Array(1);
        window.crypto.getRandomValues(arr);
        return str[arr[0] % str.length];
    }

    if (hasUpper) { rawPool += CHARS.upper; mandatory.push(getRandomChar(CHARS.upper)); }
    if (hasLower) { rawPool += CHARS.lower; mandatory.push(getRandomChar(CHARS.lower)); }
    if (hasNum) { rawPool += CHARS.num; mandatory.push(getRandomChar(CHARS.num)); }
    if (hasSym) { rawPool += CHARS.sym; mandatory.push(getRandomChar(CHARS.sym)); }

    let password = mandatory.join('');
    
    while(password.length < len) {
        password += getRandomChar(rawPool);
    }
    
    // Shuffle password completely since mandatory characters were prepended
    let pwdArr = password.split('');
    for (let i = pwdArr.length - 1; i > 0; i--) {
        const j = (new Uint32Array(1)[0] = window.crypto.getRandomValues(new Uint32Array(1))[0]) % (i + 1);
        [pwdArr[i], pwdArr[j]] = [pwdArr[j], pwdArr[i]];
    }

    password = pwdArr.join('');
    
    // UI Updates
    ui.output.value = password;
    
    const strInfo = checkStrength(len, hasUpper, hasLower, hasNum, hasSym);
    ui.strText.textContent = strInfo.text;
    ui.strText.className = `font-bold uppercase tracking-wider ${strInfo.class.split(' ')[1]}`;
    ui.strBar.style.width = strInfo.w;
    ui.strBar.className = `h-full rounded-full transition-all duration-300 ${strInfo.class.split(' ')[0]}`;
}

// Events
ui.btnGen.addEventListener('click', generatePassword);
ui.sliderLength.addEventListener('input', generatePassword);
[ui.chkUpper, ui.chkLower, ui.chkNum, ui.chkSym].forEach(el => el.addEventListener('change', generatePassword));

ui.btnCopy.addEventListener('click', async () => {
    if (!ui.output.value) return;
    try {
        await navigator.clipboard.writeText(ui.output.value);
        showToast('Password copied to clipboard!');
    } catch (err) {
        showToast('Failed to copy', 'error');
    }
});

// Init
generatePassword();
