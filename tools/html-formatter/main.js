import { getEl, showToast } from '../../src/js/utils.js';

const ui = {
    input: getEl('html-input'),
    output: getEl('html-output'),
    btnFormat: getEl('btn-format'),
    btnClear: getEl('btn-clear'),
    btnCopy: getEl('btn-copy'),
    selIndent: getEl('sel-indent')
};

function formatHtml() {
    let html = ui.input.value;
    if (!html) {
        ui.output.value = '';
        return;
    }

    const indentType = ui.selIndent.value;
    let indentChar = '    '; // Default 4 spaces
    if (indentType === '2') indentChar = '  ';
    if (indentType === 'tab') indentChar = '\t';

    // A fast regex-based HTML formatter (works well for standard HTML)
    // 1. Remove newlines and tabs
    html = html.replace(/\n/g, '').replace(/[\t ]+\</g, "<").replace(/\>[\t ]+\</g, "><").replace(/\>[\t ]+$/g, ">");
    
    let result = '';
    const lines = html.split('><');
    let pad = 0;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        
        // Restore arrows if split removed them
        if (i !== 0) line = '<' + line;
        if (i !== lines.length - 1) line = line + '>';

        let lineLen = line.length;
        let isClosingTag = line.substring(0, 2) === '</';
        let isSelfClosingTag = line.search(/<img|<br|<hr|<input|<meta|<link|<source|<keygen|<command|<base/i) > -1 || line.substring(lineLen - 2) === '/>';

        if (isClosingTag) {
            pad -= 1;
        }

        // Apply indentation
        result += '\n';
        for (let j = 0; j < pad; j++) {
            result += indentChar;
        }
        result += line;

        if (!isClosingTag && !isSelfClosingTag && line.charAt(0) === '<' && line.substring(lineLen - 1) === '>') {
            pad += 1;
        }
    }

    ui.output.value = result.trim();
}

ui.btnFormat.addEventListener('click', formatHtml);
ui.selIndent.addEventListener('change', () => {
    if (ui.output.value) formatHtml();
});

ui.btnClear.addEventListener('click', () => {
    ui.input.value = '';
    ui.output.value = '';
    ui.input.focus();
});

ui.btnCopy.addEventListener('click', async () => {
    if (!ui.output.value) return;
    try {
        await navigator.clipboard.writeText(ui.output.value);
        showToast('Formatted HTML copied!');
    } catch (err) {
        showToast('Failed to copy', 'error');
    }
});
