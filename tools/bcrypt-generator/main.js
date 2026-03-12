import { getEl, showToast } from '../../src/js/utils.js';

const ui = {
    tabHash: getEl('tab-hash'),
    tabCheck: getEl('tab-check'),
    sectHash: getEl('sect-hash'),
    sectCheck: getEl('sect-check'),
    
    strInput: getEl('str-input'),
    
    // Hash elements
    sliderRounds: getEl('slider-rounds'),
    roundsVal: getEl('rounds-val'),
    btnHash: getEl('btn-hash'),
    hashOutBox: getEl('hash-out-box'),
    hashOutput: getEl('hash-output'),
    btnCopy: getEl('btn-copy'),
    
    // Check elements
    hashInput: getEl('hash-input'),
    btnVerify: getEl('btn-verify'),
    verifyResBox: getEl('verify-res-box'),
    verifyResText: getEl('verify-res-text')
};

let mode = 'hash'; 

function switchTab(newMode) {
    if (mode === newMode) return;
    mode = newMode;
    
    const activeClass = 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm'.split(' ');
    const inactiveClass = 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white bg-transparent'.split(' ');
    
    if (mode === 'hash') {
        ui.tabHash.classList.add(...activeClass);
        ui.tabHash.classList.remove(...inactiveClass);
        ui.tabCheck.classList.add(...inactiveClass);
        ui.tabCheck.classList.remove(...activeClass);
        
        ui.sectHash.classList.remove('hidden');
        ui.sectCheck.classList.add('hidden');
    } else {
        ui.tabCheck.classList.add(...activeClass);
        ui.tabCheck.classList.remove(...inactiveClass);
        ui.tabHash.classList.add(...inactiveClass);
        ui.tabHash.classList.remove(...activeClass);
        
        ui.sectHash.classList.add('hidden');
        ui.sectCheck.classList.remove('hidden');
    }
}

// Events
ui.tabHash.addEventListener('click', () => switchTab('hash'));
ui.tabCheck.addEventListener('click', () => switchTab('check'));

ui.sliderRounds.addEventListener('input', () => {
    ui.roundsVal.textContent = ui.sliderRounds.value;
});

// Hash Logic
ui.btnHash.addEventListener('click', () => {
    const text = ui.strInput.value;
    if (!text) {
        showToast('Please enter a string to hash', 'error');
        return;
    }
    if(!window.dcodeIO || !window.dcodeIO.bcrypt) {
        showToast('Script loading, please try again.', 'error');
        return;
    }

    const rounds = parseInt(ui.sliderRounds.value);
    
    // Set loading state
    const originalText = ui.btnHash.innerHTML;
    ui.btnHash.innerHTML = '<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Generating...';
    ui.btnHash.disabled = true;

    // Async generation so we don't block the UI
    setTimeout(() => {
        try {
            const salt = window.dcodeIO.bcrypt.genSaltSync(rounds);
            const hash = window.dcodeIO.bcrypt.hashSync(text, salt);
            ui.hashOutput.value = hash;
            ui.hashOutBox.classList.remove('hidden');
        } catch(e) {
            showToast('Generation failed.', 'error');
        } finally {
            ui.btnHash.innerHTML = originalText;
            ui.btnHash.disabled = false;
        }
    }, 50);
});

// Check Logic
ui.btnVerify.addEventListener('click', () => {
    const text = ui.strInput.value;
    const hash = ui.hashInput.value.trim();
    if (!text || !hash) {
        showToast('Please enter both string and hash to verify', 'error');
        return;
    }

    if(!window.dcodeIO || !window.dcodeIO.bcrypt) return;

    try {
        const match = window.dcodeIO.bcrypt.compareSync(text, hash);
        ui.verifyResBox.classList.remove('hidden', 'bg-emerald-100', 'border-emerald-500', 'text-emerald-700', 'bg-red-100', 'border-red-500', 'text-red-700', 'dark:bg-emerald-900/40', 'dark:bg-red-900/40', 'dark:text-emerald-300', 'dark:text-red-300');
        
        if (match) {
            ui.verifyResText.textContent = '✅ Match: Password is correct!';
            ui.verifyResBox.classList.add('bg-emerald-100', 'border-emerald-500', 'text-emerald-700', 'dark:bg-emerald-900/40', 'dark:text-emerald-300');
        } else {
            ui.verifyResText.textContent = '❌ No Match: Password is incorrect.';
            ui.verifyResBox.classList.add('bg-red-100', 'border-red-500', 'text-red-700', 'dark:bg-red-900/40', 'dark:text-red-300');
        }
    } catch(e) {
        ui.verifyResBox.classList.remove('hidden');
        ui.verifyResText.textContent = 'Warning: Invalid Hash Format';
        ui.verifyResBox.classList.add('bg-yellow-100', 'border-yellow-500', 'text-yellow-700');
    }
});

ui.btnCopy.addEventListener('click', async () => {
    if (!ui.hashOutput.value) return;
    try {
        await navigator.clipboard.writeText(ui.hashOutput.value);
        showToast('Hash copied!');
    } catch (err) {
        showToast('Failed to copy', 'error');
    }
});
