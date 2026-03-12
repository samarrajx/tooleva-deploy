import { getEl, showToast } from '../../src/js/utils.js';

const ui = {
    input: getEl('uuid-input'),
    btnClear: getEl('btn-clear'),
    errorMsg: getEl('error-msg'),
    outStd: getEl('out-std'),
    outHex: getEl('out-hex'),
    outB64: getEl('out-b64'),
    outUrn: getEl('out-urn')
};

function hexToBase64(hexstring) {
    const bytes = new Uint8Array(Math.ceil(hexstring.length / 2));
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(hexstring.substr(i * 2, 2), 16);
    }
    const binString = String.fromCharCode(...bytes);
    return btoa(binString);
}


function convertUUID() {
    let rawStr = ui.input.value.trim();

    if (!rawStr) {
        ui.input.classList.remove('border-red-500', 'border-primary-500');
        ui.errorMsg.classList.add('hidden');
        ui.outStd.value = '';
        ui.outHex.value = '';
        ui.outB64.value = '';
        ui.outUrn.value = '';
        return;
    }

    // Attempt to standardize string
    let hexClean = rawStr.replace(/[^a-fA-F0-9]/g, '');

    // If string length is not 32, it might be base64. Let's try decoding base64 to hex.
    if (hexClean.length !== 32) {
        try {
            // Check if looks like b64 (22 to 24 chars usually with padding)
            const rawB64 = rawStr.replace(/[^a-zA-Z0-9+/=]/g, '');
            if (rawB64.length === 22 || rawB64.length === 24) {
                 const binStr = atob(rawB64);
                 let hexStr = '';
                 for(let i = 0; i < binStr.length; i++) {
                     const hex = binStr.charCodeAt(i).toString(16);
                     hexStr += (hex.length === 1 ? '0' + hex : hex);
                 }
                 if(hexStr.length === 32) {
                     hexClean = hexStr;
                 }
            }
        } catch(e) {
            // Not b64
        }
    }

    if (hexClean.length === 32) {
        ui.input.classList.remove('border-red-500');
        ui.input.classList.add('border-primary-500');
        ui.errorMsg.classList.add('hidden');

        const std = `${hexClean.substr(0,8)}-${hexClean.substr(8,4)}-${hexClean.substr(12,4)}-${hexClean.substr(16,4)}-${hexClean.substr(20,12)}`.toLowerCase();
        
        ui.outStd.value = std;
        ui.outHex.value = hexClean.toLowerCase();
        ui.outB64.value = hexToBase64(hexClean).replace(/==$/, ''); // Clean padding
        ui.outUrn.value = `urn:uuid:${std}`;
    } else {
        ui.input.classList.add('border-red-500');
        ui.input.classList.remove('border-primary-500');
        ui.errorMsg.classList.remove('hidden');
        
        ui.outStd.value = '';
        ui.outHex.value = '';
        ui.outB64.value = '';
        ui.outUrn.value = '';
    }
}

ui.input.addEventListener('input', convertUUID);

ui.btnClear.addEventListener('click', () => {
    ui.input.value = '';
    convertUUID();
});

document.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', async (e) => {
        const targetId = e.target.getAttribute('data-target');
        const input = document.getElementById(targetId);
        if(!input || !input.value) return;

        try {
            await navigator.clipboard.writeText(input.value);
            showToast('Copied to clipboard!');
        } catch (err) {
            showToast('Copy failed', 'error');
        }
    });
});
