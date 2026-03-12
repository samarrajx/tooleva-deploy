import { getEl, showToast } from '../../src/js/utils.js';

const ui = {
    input: getEl('css-input'),
    output: getEl('css-output'),
    btnMinify: getEl('btn-minify'),
    btnFormat: getEl('btn-format'),
    btnClear: getEl('btn-clear'),
    btnCopy: getEl('btn-copy'),
    statsBanner: getEl('stats-banner'),
    statsText: getEl('stats-text')
};

function processCss(action) {
    let css = ui.input.value.trim();
    if (!css) {
        ui.output.value = '';
        ui.statsBanner.classList.add('hidden');
        return;
    }
    
    const originalSize = new Blob([css]).size;

    if (action === 'minify') {
        // Remove comments
        css = css.replace(/\/\*[\s\S]*?\*\//g, '');
        // Remove newlines and excess whitespace
        css = css.replace(/\s+/g, ' ');
        // Remove space around structural chars
        css = css.replace(/\s*([\{\}\:\;\,\>])\s*/g, '$1');
        // Remove extra semicolons
        css = css.replace(/\;\}/g, '}');
    } else if (action === 'format') {
        // Very basic regex formatter for CSS MVP
        css = css.replace(/\/\*[\s\S]*?\*\//g, '');
        css = css.replace(/\s+/g, ' ').replace(/\s*([\{\}\:\;\,\>])\s*/g, '$1');
        css = css.replace(/\{/g, ' {\n    ').replace(/\}/g, '\n}\n\n').replace(/\;/g, ';\n    ').replace(/\,/g, ', ');
        // Fix up empty rules and trailing indents
        css = css.replace(/    \n/g, '\n').replace(/\{\n\n\}/g, '{}');
    }

    css = css.trim();
    ui.output.value = css;
    
    if (action === 'minify') {
        const newSize = new Blob([css]).size;
        const saved = originalSize - newSize;
        const percentage = originalSize ? ((saved / originalSize) * 100).toFixed(1) : 0;
        
        ui.statsText.textContent = `Saved ${percentage}% (${saved.toLocaleString()} bytes)`;
        ui.statsBanner.classList.remove('hidden');
    } else {
        ui.statsBanner.classList.add('hidden');
    }
}

ui.btnMinify.addEventListener('click', () => processCss('minify'));
ui.btnFormat.addEventListener('click', () => processCss('format'));

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
        showToast('CSS copied!');
    } catch (err) {
        showToast('Failed to copy', 'error');
    }
});
