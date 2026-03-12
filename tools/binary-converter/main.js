import { getEl, showToast } from '../../src/js/utils.js';

const ui = {
    text: getEl('val-text'),
    bin: getEl('val-bin'),
    btnClear: getEl('btn-clear'),
    btnCopy: getEl('btn-copy'),
    errorMsg: getEl('error-msg')
};

let activeSource = null;

function textToBin() {
    activeSource = 'text';
    const str = ui.text.value;
    
    if (!str) {
        ui.bin.value = '';
        ui.errorMsg.classList.add('hidden');
        return;
    }

    try {
        const binStr = Array.from(str).map(char => {
            return char.charCodeAt(0).toString(2).padStart(8, '0');
        }).join(' ');
        
        ui.bin.value = binStr;
        ui.errorMsg.classList.add('hidden');
    } catch(err) {
        ui.errorMsg.classList.remove('hidden');
    }
}

function binToText() {
    activeSource = 'bin';
    const binRaw = ui.bin.value.trim();
    
    if (!binRaw) {
        ui.text.value = '';
        ui.errorMsg.classList.add('hidden');
        return;
    }

    // Attempt to split by spaces, or group by 8 if no spaces.
    let binArray = [];
    if (binRaw.includes(' ')) {
        binArray = binRaw.split(/\s+/);
    } else {
        binArray = binRaw.match(/.{1,8}/g) || [];
    }

    try {
        const str = binArray.map(b => {
             // Basic validation
             if (!/^[01]+$/.test(b)) throw new Error('Invalid bit');
             return String.fromCharCode(parseInt(b, 2));
        }).join('');
        
        ui.text.value = str;
        ui.errorMsg.classList.add('hidden');
    } catch(err) {
        ui.errorMsg.classList.remove('hidden');
    }
}

ui.text.addEventListener('input', textToBin);

ui.bin.addEventListener('input', binToText);

ui.btnClear.addEventListener('click', () => {
    ui.text.value = '';
    ui.bin.value = '';
    ui.errorMsg.classList.add('hidden');
});

ui.btnCopy.addEventListener('click', async () => {
    if (!ui.bin.value) return;
    try {
        await navigator.clipboard.writeText(ui.bin.value);
        showToast('Binary data copied!');
    } catch(err) {
        showToast('Failed to copy', 'error');
    }
});
