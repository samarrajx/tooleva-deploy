import { getEl, showToast } from '../../src/js/utils.js';

const ui = {
    input: getEl('text-input'),
    outMd5: getEl('out-md5'),
    outSha1: getEl('out-sha1'),
    outSha256: getEl('out-sha256'),
    outSha512: getEl('out-sha512'),
    btnCopies: document.querySelectorAll('.btn-copy-hash')
};

function generateHashes() {
    const text = ui.input.value;
    
    if (!text) {
        ui.outMd5.value = '';
        ui.outSha1.value = '';
        ui.outSha256.value = '';
        ui.outSha512.value = '';
        return;
    }
    
    // Leverage CryptoJS via global window object embedded in HTML
    if (window.CryptoJS) {
        ui.outMd5.value = CryptoJS.MD5(text).toString();
        ui.outSha1.value = CryptoJS.SHA1(text).toString();
        ui.outSha256.value = CryptoJS.SHA256(text).toString();
        ui.outSha512.value = CryptoJS.SHA512(text).toString();
    }
}

ui.input.addEventListener('input', generateHashes);

ui.btnCopies.forEach(btn => {
    btn.addEventListener('click', async (e) => {
        const targetId = e.target.dataset.target;
        const inputToCopy = document.getElementById(targetId);
        if (!inputToCopy.value) return;
        
        try {
            await navigator.clipboard.writeText(inputToCopy.value);
            showToast('Hash copied to clipboard!');
        } catch (err) {
            showToast('Failed to copy', 'error');
        }
    });
});
