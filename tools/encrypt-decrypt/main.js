import { getEl, showToast } from '../../src/js/utils.js';

const ui = {
    tabEnc: getEl('tab-encrypt'),
    tabDec: getEl('tab-decrypt'),
    lblInput: getEl('lbl-input'),
    lblOutput: getEl('lbl-output'),
    keyInput: getEl('secret-key'),
    textInput: getEl('text-input'),
    textOutput: getEl('text-output'),
    btnClear: getEl('btn-clear'),
    btnCopy: getEl('btn-copy'),
    errorMsg: getEl('error-msg')
};

let mode = 'encrypt'; // 'encrypt' or 'decrypt'

function switchTab(newMode) {
    if (mode === newMode) return;
    mode = newMode;
    
    // UI Classes
    const activeClass = 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm'.split(' ');
    const inactiveClass = 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white bg-transparent'.split(' ');
    
    if (mode === 'encrypt') {
        ui.tabEnc.classList.add(...activeClass);
        ui.tabEnc.classList.remove(...inactiveClass);
        
        ui.tabDec.classList.add(...inactiveClass);
        ui.tabDec.classList.remove(...activeClass);
        
        ui.lblInput.textContent = 'Plain Text to Encrypt';
        ui.lblOutput.textContent = 'Encrypted Output';
    } else {
        ui.tabDec.classList.add(...activeClass);
        ui.tabDec.classList.remove(...inactiveClass);
        
        ui.tabEnc.classList.add(...inactiveClass);
        ui.tabEnc.classList.remove(...activeClass);
        
        ui.lblInput.textContent = 'Encrypted Text to Decrypt';
        ui.lblOutput.textContent = 'Decrypted Plain Text';
    }
    
    // Clear on switch
    ui.textInput.value = '';
    ui.textOutput.value = '';
    ui.errorMsg.classList.add('hidden');
    ui.textInput.focus();
}

function process() {
    const text = ui.textInput.value.trim();
    const key = ui.keyInput.value;
    
    ui.errorMsg.classList.add('hidden');
    
    if (!text || !key) {
        ui.textOutput.value = '';
        return;
    }
    
    if (!window.CryptoJS) return; // Not loaded yet
    
    if (mode === 'encrypt') {
        try {
            const encrypted = CryptoJS.AES.encrypt(text, key).toString();
            ui.textOutput.value = encrypted;
        } catch (e) {
            ui.textOutput.value = '';
            ui.errorMsg.classList.remove('hidden');
        }
    } else {
        try {
            const decrypted = CryptoJS.AES.decrypt(text, key);
            const str = decrypted.toString(CryptoJS.enc.Utf8);
            if (!str) {
                 ui.textOutput.value = '';
                 ui.errorMsg.classList.remove('hidden');
            } else {
                 ui.textOutput.value = str;
            }
        } catch (e) {
            ui.textOutput.value = '';
            ui.errorMsg.classList.remove('hidden');
        }
    }
}

// Events
ui.tabEnc.addEventListener('click', () => switchTab('encrypt'));
ui.tabDec.addEventListener('click', () => switchTab('decrypt'));

ui.textInput.addEventListener('input', process);
ui.keyInput.addEventListener('input', process);

ui.btnClear.addEventListener('click', () => {
    ui.textInput.value = '';
    ui.textOutput.value = '';
    ui.errorMsg.classList.add('hidden');
});

ui.btnCopy.addEventListener('click', async () => {
    if (!ui.textOutput.value) return;
    try {
        await navigator.clipboard.writeText(ui.textOutput.value);
        showToast('Copied to clipboard!');
    } catch (err) {
        showToast('Failed to copy', 'error');
    }
});
