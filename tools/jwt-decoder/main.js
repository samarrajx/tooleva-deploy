import { getEl } from '../../src/js/utils.js';

const ui = {
    input: getEl('jwt-input'),
    outHeader: getEl('out-header'),
    outPayload: getEl('out-payload'),
    badgeValid: getEl('badge-valid'),
    badgeInvalid: getEl('badge-invalid')
};

// Colors JWT string for visual feedback mapping encoded parts to logic parts
function highlightInput(val) {
    const parts = val.split('.');
    
    // We cannot reliably syntax highlight a raw textarea, so we apply simple colored text overlay
    // Actually, simpler to just color the border/badges. 
}

function decodeBase64Url(str) {
    // Base64Url to Base64
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    // Pad
    while (str.length % 4) {
        str += '=';
    }
    // Decode UTF-8 string
    const binString = atob(str);
    const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0));
    return new TextDecoder().decode(bytes);
}

function processJwt() {
    const token = ui.input.value.trim();
    
    if (!token) {
        ui.outHeader.textContent = '{}';
        ui.outPayload.textContent = '{}';
        ui.badgeValid.classList.add('hidden');
        ui.badgeInvalid.classList.add('hidden');
        ui.input.classList.remove('text-red-500');
        return;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
        // Not a standard JWT
        ui.outHeader.textContent = 'Invalid JWT format (requires 3 parts separated by dots)';
        ui.outPayload.textContent = '';
        ui.badgeValid.classList.add('hidden');
        ui.badgeInvalid.classList.remove('hidden');
        return;
    }

    try {
        const headerStr = decodeBase64Url(parts[0]);
        const payloadStr = decodeBase64Url(parts[1]);

        // Format as JSON
        const headerJson = JSON.parse(headerStr);
        const payloadJson = JSON.parse(payloadStr);

        ui.outHeader.textContent = JSON.stringify(headerJson, null, 2);
        ui.outPayload.textContent = JSON.stringify(payloadJson, null, 2);

        ui.badgeValid.classList.remove('hidden');
        ui.badgeInvalid.classList.add('hidden');

    } catch (err) {
        ui.outHeader.textContent = 'Failed to decode Base64Url or parse JSON.';
        ui.outPayload.textContent = err.toString();
        ui.badgeValid.classList.add('hidden');
        ui.badgeInvalid.classList.remove('hidden');
    }
}

ui.input.addEventListener('input', processJwt);
