import { getEl, showToast } from '../../src/js/utils.js';

const ui = {
    inputUser: getEl('input-username'),
    inputPass: getEl('input-password'),
    selAlgo: getEl('sel-algo'),
    btnGen: getEl('btn-generate'),
    textOutput: getEl('text-output'),
    btnCopy: getEl('btn-copy'),
    btnClear: getEl('btn-clear')
};

function generateHtpasswd() {
    let username = ui.inputUser.value.trim();
    let password = ui.inputPass.value;
    let algo = ui.selAlgo.value;

    if (!username || !password) {
        showToast('Please provide both username and password.', 'error');
        return;
    }

    if (username.includes(':')) {
        showToast('Username cannot contain a colon (:).', 'error');
        return;
    }

    let hash = '';

    if (algo === 'bcrypt') {
        if (!window.dcodeIO || !window.dcodeIO.bcrypt) {
            showToast('Bcrypt library is loading...', 'error');
            return;
        }
        // Apache uses $2y$ prefix for modern bcrypt. JS library uses generic algorithms.
        const salt = window.dcodeIO.bcrypt.genSaltSync(10);
        hash = window.dcodeIO.bcrypt.hashSync(password, salt);
        // Ensure Apache compat format
        if (hash.startsWith('$2a$')) hash = '$2y$' + hash.substring(4);
    } else if (algo === 'sha1') {
        if (!window.CryptoJS) return;
        // htpasswd uses Base64 encoded SHA1 prefixed with {SHA}
        const sha1WordArr = CryptoJS.SHA1(password);
        const base64Hash = CryptoJS.enc.Base64.stringify(sha1WordArr);
        hash = '{SHA}' + base64Hash;
    }

    const newLine = `${username}:${hash}\n`;
    ui.textOutput.value += newLine;
    
    // Clear inputs for rapid adding
    ui.inputUser.value = '';
    ui.inputPass.value = '';
    ui.inputUser.focus();
}

ui.btnGen.addEventListener('click', generateHtpasswd);
ui.inputPass.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') generateHtpasswd();
});

ui.btnCopy.addEventListener('click', async () => {
    if (!ui.textOutput.value) return;
    try {
        await navigator.clipboard.writeText(ui.textOutput.value);
        showToast('Generated htpasswd lines copied!');
    } catch (err) {
        showToast('Failed to copy', 'error');
    }
});

ui.btnClear.addEventListener('click', () => {
    ui.textOutput.value = '';
});
