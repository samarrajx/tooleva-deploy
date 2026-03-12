import { getEl, showToast } from '../../src/js/utils.js';

const ui = {
    qty: getEl('gen-qty'),
    chkUppercase: getEl('chk-uppercase'),
    chkBraces: getEl('chk-braces'),
    chkQuotes: getEl('chk-quotes'),
    chkHyphens: getEl('chk-hyphens'),
    btnGenerate: getEl('btn-generate'),
    btnCopy: getEl('btn-copy'),
    output: getEl('text-output')
};

function generateUUIDv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function generate() {
    let qty = parseInt(ui.qty.value);
    if (isNaN(qty) || qty < 1) qty = 1;
    if (qty > 5000) qty = 5000;
    ui.qty.value = qty;

    const isUpper = ui.chkUppercase.checked;
    const isBraces = ui.chkBraces.checked;
    const isQuotes = ui.chkQuotes.checked;
    const isHyphens = ui.chkHyphens.checked;

    let result = [];
    for (let i = 0; i < qty; i++) {
        let uuid = generateUUIDv4();
        
        if (!isHyphens) uuid = uuid.replace(/-/g, '');
        if (isUpper) uuid = uuid.toUpperCase();
        if (isBraces) uuid = `{${uuid}}`;
        if (isQuotes) uuid = `"${uuid}"`;
        
        result.push(uuid);
    }

    ui.output.value = result.join('\n');
}

ui.btnGenerate.addEventListener('click', generate);

ui.btnCopy.addEventListener('click', async () => {
    if (!ui.output.value) return;
    try {
        await navigator.clipboard.writeText(ui.output.value);
        showToast('UUIDs copied to clipboard!');
    } catch (err) {
        showToast('Failed to copy', 'error');
    }
});

// Initial Gen
generate();
