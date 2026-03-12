import { getEl, showToast } from '../../src/js/utils.js';

const ui = {
    previewArea: getEl('color-preview'),
    titleHex: getEl('color-hex-title'),
    btnGenerate: getEl('btn-generate'),
    outHex: getEl('out-hex'),
    outRgb: getEl('out-rgb'),
    outHsl: getEl('out-hsl')
};

// Math helpers for conversion
function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return { r, g, b };
}

function updateColor() {
    const { r, g, b } = getRandomColor();
    
    // Format HEX
    const hex = '#' + [r, g, b].map(x => {
        const h = x.toString(16);
        return h.length === 1 ? '0' + h : h;
    }).join('').toUpperCase();

    // Format RGB
    const rgb = `rgb(${r}, ${g}, ${b})`;

    // Format HSL
    const [h, s, l] = rgbToHsl(r, g, b);
    const hsl = `hsl(${h}, ${s}%, ${l}%)`;

    // Apply UI
    ui.previewArea.style.backgroundColor = hex;
    ui.titleHex.textContent = hex;
    
    ui.outHex.value = hex;
    ui.outRgb.value = rgb;
    ui.outHsl.value = hsl;
}

// Ensure high contrast text logic using mix-blend-mode in CSS handles title

// Events
ui.btnGenerate.addEventListener('click', updateColor);

// Global click on preview area
ui.previewArea.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(ui.outHex.value);
        showToast('Base HEX copied!');
    } catch (err) { }
});

// Setup multiple copy buttons
document.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', async (e) => {
        const targetId = e.target.getAttribute('data-target');
        const input = document.getElementById(targetId);
        if(!input) return;

        try {
            await navigator.clipboard.writeText(input.value);
            showToast(`${targetId.replace('out-', '').toUpperCase()} Format copied!`);
        } catch (err) {
            showToast('Copy failed', 'error');
        }
    });
});

// Init on load
updateColor();
