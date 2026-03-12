import { getEl, showToast } from '../../src/js/utils.js';

const ui = {
    input: getEl('qr-input'),
    colorFg: getEl('qr-color-fg'),
    colorBg: getEl('qr-color-bg'),
    lblFg: getEl('lbl-color-fg'),
    lblBg: getEl('lbl-color-bg'),
    ecLevel: getEl('qr-ec-level'),
    container: getEl('qr-container'),
    emptyText: getEl('empty-state-text'),
    btnDownload: getEl('btn-download')
};

let qrObj = null;

function renderQR() {
    const text = ui.input.value.trim();
    if (!text) {
        ui.container.innerHTML = '';
        ui.emptyText.classList.remove('hidden');
        ui.btnDownload.disabled = true;
        qrObj = null;
        return;
    }

    ui.emptyText.classList.add('hidden');
    ui.container.innerHTML = '';
    
    // Convert EC level
    let corLevel = QRCode.CorrectLevel.H;
    switch(ui.ecLevel.value) {
        case 'L': corLevel = QRCode.CorrectLevel.L; break;
        case 'M': corLevel = QRCode.CorrectLevel.M; break;
        case 'Q': corLevel = QRCode.CorrectLevel.Q; break;
    }

    qrObj = new QRCode(ui.container, {
        text: text,
        width: 256,
        height: 256,
        colorDark : ui.colorFg.value,
        colorLight : ui.colorBg.value,
        correctLevel : corLevel
    });
    
    ui.btnDownload.disabled = false;
}

// Events
ui.input.addEventListener('input', renderQR);

ui.colorFg.addEventListener('input', (e) => {
    ui.lblFg.textContent = e.target.value.toUpperCase();
    renderQR();
});

ui.colorBg.addEventListener('input', (e) => {
    ui.lblBg.textContent = e.target.value.toUpperCase();
    renderQR();
});

ui.ecLevel.addEventListener('change', renderQR);

ui.btnDownload.addEventListener('click', () => {
    if (!qrObj) return;
    try {
        const img = ui.container.querySelector('img');
        const canvas = ui.container.querySelector('canvas');
        
        // QR Code JS might render either img or canvas depending on browser
        let src = '';
        if (img && img.src) src = img.src;
        else if (canvas) src = canvas.toDataURL("image/png");
        else return;

        const a = document.createElement('a');
        a.href = src;
        a.download = 'tooleva-qrcode.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast('QR Code downloaded!');
    } catch(err) {
        showToast('Failed to download image.', 'error');
    }
});
