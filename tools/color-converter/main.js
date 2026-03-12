import { getEl, showToast } from '../../src/js/utils.js';

const ui = {
    picker: getEl('color-picker'),
    input: getEl('color-input'),
    previewBox: getEl('preview-box'),
    outHex: getEl('out-hex'),
    outRgb: getEl('out-rgb'),
    outHsl: getEl('out-hsl'),
    btnCopies: document.querySelectorAll('.btn-copy-format')
};

// --- Conversion Utilities (Vanilla JS without external libs) ---

function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return [r, g, b];
}

function rgbToHex(r, g, b) {
    const toHex = (c) => {
        const h = c.toString(16);
        return h.length === 1 ? '0' + h : h;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if(max === min){
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToRgb(h, s, l) {
    let r, g, b;
    h /= 360; s /= 100; l /= 100;

    if(s === 0){
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function parseColorString(str) {
    str = str.trim().toLowerCase();
    
    // Hex
    if (/^#?[0-9a-f]{3,6}$/.test(str)) {
        let hex = str.startsWith('#') ? str : '#' + str;
        // Expand shorthand hex
        if (hex.length === 4) {
            hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
        }
        if (hex.length === 7) {
            const rgb = hexToRgb(hex);
            return {
                hex: hex.toUpperCase(),
                rgb: rgb,
                hsl: rgbToHsl(rgb[0], rgb[1], rgb[2])
            };
        }
    }
    
    // RGB
    let rgbMatch = str.match(/^rgb\(?\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)?$/);
    if (rgbMatch) {
        const r = parseInt(rgbMatch[1]);
        const g = parseInt(rgbMatch[2]);
        const b = parseInt(rgbMatch[3]);
        if (r <= 255 && g <= 255 && b <= 255) {
            return {
                hex: rgbToHex(r, g, b),
                rgb: [r, g, b],
                hsl: rgbToHsl(r, g, b)
            };
        }
    }

    // HSL
    let hslMatch = str.match(/^hsl\(?\s*(\d{1,3})\s*,\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*\)?$/);
    if (hslMatch) {
        const h = parseInt(hslMatch[1]);
        const s = parseInt(hslMatch[2].replace('%', ''));
        const l = parseInt(hslMatch[3].replace('%', ''));
        if (h <= 360 && s <= 100 && l <= 100) {
            const rgb = hslToRgb(h, s, l);
            return {
                hex: rgbToHex(rgb[0], rgb[1], rgb[2]),
                rgb: rgb,
                hsl: [h, s, l]
            };
        }
    }

    return null; // Invalid
}

function updateColors(source, value) {
    let colorData = null;
    
    if (source === 'picker') {
        colorData = parseColorString(value);
        if (colorData) ui.input.value = colorData.hex;
    } else {
        colorData = parseColorString(value);
        if (colorData) ui.picker.value = colorData.hex;
    }

    if (colorData) {
        ui.previewBox.style.backgroundColor = colorData.hex;
        
        // Ensure hex string has hash for out-hex
        const outHexVal = colorData.hex.startsWith('#') ? colorData.hex : '#' + colorData.hex;
        ui.outHex.value = outHexVal;
        
        ui.outRgb.value = `rgb(${colorData.rgb[0]}, ${colorData.rgb[1]}, ${colorData.rgb[2]})`;
        ui.outHsl.value = `hsl(${colorData.hsl[0]}, ${colorData.hsl[1]}%, ${colorData.hsl[2]}%)`;
        
        ui.input.classList.remove('border-red-500', 'focus:ring-red-500');
    } else {
        // Invalid input
        ui.input.classList.add('border-red-500', 'focus:ring-red-500');
    }
}

// Event Listeners
ui.picker.addEventListener('input', (e) => updateColors('picker', e.target.value));
ui.input.addEventListener('input', (e) => updateColors('input', e.target.value));

ui.btnCopies.forEach(btn => {
    btn.addEventListener('click', async (e) => {
        const targetId = e.target.dataset.target;
        const inputToCopy = document.getElementById(targetId);
        if (!inputToCopy.value) return;
        
        try {
            await navigator.clipboard.writeText(inputToCopy.value);
            showToast('Color format copied!');
        } catch (err) {
            showToast('Failed to copy', 'error');
        }
    });
});

// Initialize
updateColors('picker', ui.picker.value);
