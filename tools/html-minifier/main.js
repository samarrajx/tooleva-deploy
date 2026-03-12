import { getEl, showToast } from '../../src/js/utils.js';

const ui = {
    input: getEl('html-input'),
    output: getEl('html-output'),
    btnMinify: getEl('btn-minify'),
    btnClear: getEl('btn-clear'),
    btnCopy: getEl('btn-copy'),
    chkComments: getEl('chk-comments'),
    statsBanner: getEl('stats-banner'),
    statsText: getEl('stats-text')
};

function minifyHtml() {
    let html = ui.input.value.trim();
    if (!html) {
        ui.output.value = '';
        ui.statsBanner.classList.add('hidden');
        return;
    }
    
    const originalSize = new Blob([html]).size;

    // Remove comments
    if (ui.chkComments.checked) {
        // Regex to safely remove HTML comments without breaking conditional IE comments or scripts
        html = html.replace(/<!--[\s\S]*?(?:-->|$)/g, function(match) {
            if (/<!--\[if/.test(match)) return match; // Keep IE conditionals
            return '';
        });
    }

    // Minify Whitespace
    // Collapse newlines, tabs, and multiple spaces into a single space
    html = html.replace(/\s+/g, ' ');
    
    // Remove space between tags
    html = html.replace(/>\s+</g, '><');
    
    // Trim
    html = html.trim();

    ui.output.value = html;
    
    const newSize = new Blob([html]).size;
    const saved = originalSize - newSize;
    const percentage = originalSize ? ((saved / originalSize) * 100).toFixed(1) : 0;
    
    ui.statsText.textContent = `Saved ${percentage}% (${saved.toLocaleString()} bytes)`;
    ui.statsBanner.classList.remove('hidden');
}

ui.btnMinify.addEventListener('click', minifyHtml);

ui.btnClear.addEventListener('click', () => {
    ui.input.value = '';
    ui.output.value = '';
    ui.statsBanner.classList.add('hidden');
    ui.input.focus();
});

ui.btnCopy.addEventListener('click', async () => {
    if (!ui.output.value) return;
    try {
        await navigator.clipboard.writeText(ui.output.value);
        showToast('Minified HTML copied!');
    } catch (err) {
        showToast('Failed to copy', 'error');
    }
});
