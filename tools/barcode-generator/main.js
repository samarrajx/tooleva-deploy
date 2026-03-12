import { getEl, showToast } from '../../src/js/utils.js';

const ui = {
    input: getEl('bc-input'),
    format: getEl('bc-format'),
    chkDisplayVal: getEl('chk-display-val'),
    colorFg: getEl('bc-color-fg'),
    colorBg: getEl('bc-color-bg'),
    canvas: getEl('barcode-canvas'),
    btnDownload: getEl('btn-download'),
    errorMsg: getEl('error-msg')
};

function renderBarcode() {
    const val = ui.input.value;
    if (!val) {
        ui.canvas.innerHTML = '';
        ui.btnDownload.disabled = true;
        ui.errorMsg.classList.add('hidden');
        return;
    }
    
    if(!window.JsBarcode) return;

    try {
        ui.errorMsg.classList.add('hidden');
        ui.input.classList.remove('border-red-500');
        
        JsBarcode("#barcode-canvas", val, {
            format: ui.format.value,
            lineColor: ui.colorFg.value,
            background: ui.colorBg.value,
            width: 2,
            height: 100,
            displayValue: ui.chkDisplayVal.checked
        });
        ui.btnDownload.disabled = false;
    } catch(err) {
        // Handle format specific length/character validations thrown by JsBarcode
        ui.canvas.innerHTML = '';
        ui.errorMsg.classList.remove('hidden');
        ui.errorMsg.textContent = 'Invalid format or characters. EAN/UPC require specific numbers and lengths.';
        ui.input.classList.add('border-red-500');
        ui.btnDownload.disabled = true;
    }
}

// Events
ui.input.addEventListener('input', renderBarcode);
ui.format.addEventListener('change', renderBarcode);
ui.chkDisplayVal.addEventListener('change', renderBarcode);
ui.colorFg.addEventListener('input', renderBarcode);
ui.colorBg.addEventListener('input', renderBarcode);

ui.btnDownload.addEventListener('click', () => {
    try {
        const svgElement = ui.canvas;
        if (!svgElement || !svgElement.outerHTML) return;
        
        // Convert SVG to string
        const svgData = new XMLSerializer().serializeToString(svgElement);
        
        // Create a blob for download
        const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `tooleva-barcode-${ui.format.value}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
        showToast('Barcode SVG downloaded!');
    } catch(err) {
        showToast('Failed to download barcode.', 'error');
    }
});

// Init
window.addEventListener('load', () => { setTimeout(renderBarcode, 200); });
