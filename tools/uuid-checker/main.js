import { getEl } from '../../src/js/utils.js';

const ui = {
    input: getEl('uuid-input'),
    btnClear: getEl('btn-clear'),
    iconPass: getEl('icon-pass'),
    iconFail: getEl('icon-fail'),
    
    resultBox: getEl('result-box'),
    header: getEl('result-header'),
    title: getEl('result-title'),
    
    oVersion: getEl('out-version'),
    oVariant: getEl('out-variant'),
    oCanonical: getEl('out-canonical'),
    oUrn: getEl('out-urn')
};

function checkUUID() {
    let rawStr = ui.input.value.trim();
    
    if (!rawStr) {
        ui.resultBox.classList.add('hidden');
        ui.iconPass.classList.add('hidden');
        ui.iconFail.classList.add('hidden');
        ui.input.classList.remove('border-emerald-500', 'border-red-500');
        return;
    }
    
    // Strip urn:uuid: prefix or curly braces if present
    rawStr = rawStr.replace(/^urn:uuid:/i, '').replace(/[{}]/g, '');

    ui.resultBox.classList.remove('hidden');

    // Validation using standard UUID regex pattern
    const validRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    const isValid = validRegex.test(rawStr);

    if (isValid) {
        // Valid
        ui.iconPass.classList.remove('hidden');
        ui.iconFail.classList.add('hidden');
        ui.input.classList.add('border-emerald-500');
        ui.input.classList.remove('border-red-500');
        
        ui.title.textContent = "Valid UUID";
        ui.header.className = "p-4 flex items-center justify-between border-b border-emerald-500 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";

        // Extract properties (RFC 4122)
        const parts = rawStr.split('-');
        
        // Version is the first char of the 3rd group
        const version = parts[2].charAt(0);
        
        // Variant is the first char of the 4th group
        const variantChar = parts[3].charAt(0).toLowerCase();
        let variantStr = 'Unknown';
        if (['8', '9', 'a', 'b'].includes(variantChar)) variantStr = 'RFC 4122 (Variant 1)';
        else if (['c', 'd'].includes(variantChar)) variantStr = 'Reserved (Microsoft)';
        else if (['e', 'f'].includes(variantChar)) variantStr = 'Reserved (Future)';
        else variantStr = 'NCS (Variant 0)';

        ui.oVersion.textContent = version ? `Version ${version}` : 'Unknown';
        ui.oVariant.textContent = variantStr;
        
        const canonical = rawStr.toLowerCase();
        ui.oCanonical.textContent = canonical;
        ui.oUrn.textContent = `urn:uuid:${canonical}`;

    } else {
        // Invalid
        ui.iconPass.classList.add('hidden');
        ui.iconFail.classList.remove('hidden');
        ui.input.classList.add('border-red-500');
        ui.input.classList.remove('border-emerald-500');

        ui.title.textContent = "Invalid UUID";
        ui.header.className = "p-4 flex items-center justify-between border-b border-red-500 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";

        ui.oVersion.textContent = 'Invalid Format';
        ui.oVariant.textContent = 'Invalid Format';
        ui.oCanonical.textContent = 'N/A';
        ui.oUrn.textContent = 'N/A';
    }
}

// Events
ui.input.addEventListener('input', checkUUID);

ui.btnClear.addEventListener('click', () => {
    ui.input.value = '';
    checkUUID();
});
