import { getEl, showToast } from '../../src/js/utils.js';

const ui = {
    tabHide: getEl('tab-hide'),
    tabReveal: getEl('tab-reveal'),
    sectHide: getEl('sect-hide'),
    sectReveal: getEl('sect-reveal'),
    
    // Hide
    publicInput: getEl('public-input'),
    secretInput: getEl('secret-input'),
    btnHide: getEl('btn-hide'),
    hideOutBox: getEl('hide-out-box'),
    hiddenOutput: getEl('hidden-output'),
    btnCopy: getEl('btn-copy'),

    // Reveal
    revealInput: getEl('reveal-input'),
    btnReveal: getEl('btn-reveal'),
    revealOutBox: getEl('reveal-out-box'),
    revealedOutput: getEl('revealed-output'),
    btnClear: getEl('btn-clear')
};

let mode = 'hide';

function switchTab(newMode) {
    if (mode === newMode) return;
    mode = newMode;
    
    const activeClass = 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm'.split(' ');
    const inactiveClass = 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white bg-transparent'.split(' ');
    
    if (mode === 'hide') {
        ui.tabHide.classList.add(...activeClass);
        ui.tabHide.classList.remove(...inactiveClass);
        ui.tabReveal.classList.add(...inactiveClass);
        ui.tabReveal.classList.remove(...activeClass);
        
        ui.sectHide.classList.remove('hidden');
        ui.sectReveal.classList.add('hidden');
    } else {
        ui.tabReveal.classList.add(...activeClass);
        ui.tabReveal.classList.remove(...inactiveClass);
        ui.tabHide.classList.add(...inactiveClass);
        ui.tabHide.classList.remove(...activeClass);
        
        ui.sectHide.classList.add('hidden');
        ui.sectReveal.classList.remove('hidden');
    }
}

ui.tabHide.addEventListener('click', () => switchTab('hide'));
ui.tabReveal.addEventListener('click', () => switchTab('reveal'));


// Zero-width characters for binary encoding
const ZERO_WIDTH_CHARS = {
    '0': '\u200B', // Zero width space
    '1': '\u200C', // Zero width non-joiner
    'split': '\u200D' // Zero width joiner
};

// Map char codes to binary representations and then to zero-width chars
function textToZeroWidth(text) {
    return text.split('').map(char => {
        const binStr = char.charCodeAt(0).toString(2); // Convert to binary
        return binStr.split('').map(b => ZERO_WIDTH_CHARS[b]).join('') + ZERO_WIDTH_CHARS['split'];
    }).join('');
}

// Convert zero-width chars back to normal text
function zeroWidthToText(zeroStr) {
    if (!zeroStr) return '';
    // Extract only the zero width characters
    const regex = new RegExp(`[${ZERO_WIDTH_CHARS['0']}${ZERO_WIDTH_CHARS['1']}${ZERO_WIDTH_CHARS['split']}]+`, 'g');
    const matches = zeroStr.match(regex);
    if (!matches) return '';

    const hiddenStr = matches.join('');
    
    return hiddenStr.split(ZERO_WIDTH_CHARS['split']).filter(Boolean).map(binMap => {
        const binStr = binMap.split('').map(char => {
            if (char === ZERO_WIDTH_CHARS['0']) return '0';
            if (char === ZERO_WIDTH_CHARS['1']) return '1';
            return '';
        }).join('');
        return String.fromCharCode(parseInt(binStr, 2));
    }).join('');
}

// Logic Hide
ui.btnHide.addEventListener('click', () => {
    const publicTxt = ui.publicInput.value;
    const secretTxt = ui.secretInput.value;

    if (!publicTxt) {
        showToast('Please enter a Public Cover Text', 'error');
        return;
    }
    if (!secretTxt) {
        showToast('Please enter a secret message', 'error');
        return;
    }

    const hiddenBytes = textToZeroWidth(secretTxt);
    
    // Inject at start of public text
    const combined = hiddenBytes + publicTxt;
    
    ui.hiddenOutput.value = combined;
    ui.hideOutBox.classList.remove('hidden');
});

// Logic Reveal
ui.btnReveal.addEventListener('click', () => {
    const combined = ui.revealInput.value;
    if (!combined) {
        ui.revealOutBox.classList.add('hidden');
        return;
    }

    const secret = zeroWidthToText(combined);

    if (secret) {
        ui.revealedOutput.value = secret;
        ui.revealOutBox.classList.remove('hidden');
    } else {
        ui.revealedOutput.value = 'No secret message was found encoded in this text.';
        ui.revealOutBox.classList.remove('hidden');
    }
});

ui.btnCopy.addEventListener('click', async () => {
    if (!ui.hiddenOutput.value) return;
    try {
        await navigator.clipboard.writeText(ui.hiddenOutput.value);
        showToast('Combined text copied. Send it anywhere safely!');
    } catch (err) {
        showToast('Failed to copy', 'error');
    }
});

ui.btnClear.addEventListener('click', () => {
    ui.revealInput.value = '';
    ui.revealedOutput.value = '';
    ui.revealOutBox.classList.add('hidden');
});
