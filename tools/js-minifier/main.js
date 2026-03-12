import { getEl, showToast } from '../../src/js/utils.js';

const ui = {
    input: getEl('js-input'),
    output: getEl('js-output'),
    btnMinify: getEl('btn-minify'),
    btnClear: getEl('btn-clear'),
    btnCopy: getEl('btn-copy'),
    chkComments: getEl('chk-comments'),
    statsBanner: getEl('stats-banner'),
    statsText: getEl('stats-text')
};

function minifyJs() {
    let js = ui.input.value.trim();
    if (!js) {
        ui.output.value = '';
        ui.statsBanner.classList.add('hidden');
        return;
    }
    
    const originalSize = new Blob([js]).size;

    if (ui.chkComments.checked) {
        // Remove Single line comments (careful with URLs)
        // A robust but simple regex for basic needs:
        js = js.replace(/(?:^|\s)\/\/(.+?)$/gm, "");
        // Remove Multi-line comments
        js = js.replace(/\/\*[\s\S]*?\*\//g, "");
    }

    // Replace multiple spaces/newlines with a single space
    js = js.replace(/\s+/g, " ");

    // Remove spaces around common operators and structural characters
    js = js.replace(/\s*([=+\-*/%&|<>!?:;,{}()\[\]])\s*/g, "$1");

    ui.output.value = js.trim();
    
    const newSize = new Blob([js]).size;
    const saved = originalSize - newSize;
    const percentage = originalSize ? ((saved / originalSize) * 100).toFixed(1) : 0;
    
    ui.statsText.textContent = `Saved ${percentage}% (${saved.toLocaleString()} bytes)`;
    ui.statsBanner.classList.remove('hidden');
}

ui.btnMinify.addEventListener('click', minifyJs);

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
        showToast('Minified JS copied!');
    } catch (err) {
        showToast('Failed to copy', 'error');
    }
});
