import { getEl, showToast } from '../../src/js/utils.js';

const ui = {
    type: getEl('gen-type'),
    qty: getEl('gen-qty'),
    chkHtml: getEl('chk-html'),
    
    btnGen: getEl('btn-generate'),
    btnCopy: getEl('btn-copy'),
    output: getEl('text-output')
};

const WORDS = [
    "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
    "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
    "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation",
    "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea", "commodo", "consequat",
    "duis", "aute", "irure", "dolor", "in", "reprehenderit", "in", "voluptate", "velit",
    "esse", "cillum", "dolore", "eu", "fugiat", "nulla", "pariatur", "excepteur", "sint",
    "occaecat", "cupidatat", "non", "proident", "sunt", "in", "culpa", "qui", "officia",
    "deserunt", "mollit", "anim", "id", "est", "laborum"
];

function getRandomWord() {
    return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function generateSentence(isFirst) {
    // 5 to 12 words per sentence
    const length = Math.floor(Math.random() * 8) + 5; 
    let sentence = [];
    
    // Always start first gen with Lorem Ipsum if requested mostly, but randomize otherwise
    if (isFirst) {
        sentence.push("Lorem", "ipsum", "dolor", "sit", "amet,");
        for (let i = 5; i < length; i++) {
            sentence.push(getRandomWord());
        }
    } else {
        for (let i = 0; i < length; i++) {
            let word = getRandomWord();
            if (i === 0) {
                word = word.charAt(0).toUpperCase() + word.slice(1);
            }
            sentence.push(word);
        }
    }
    
    return sentence.join(' ') + '.';
}

function generateParagraph(isFirst) {
    // 3 to 7 sentences per paragraph
    const length = Math.floor(Math.random() * 5) + 3;
    let para = [];
    for (let i = 0; i < length; i++) {
        para.push(generateSentence(isFirst && i === 0));
    }
    return para.join(' ');
}

function generateText() {
    const type = ui.type.value;
    let qty = parseInt(ui.qty.value);
    const useHtml = ui.chkHtml.checked;
    
    if (isNaN(qty) || qty < 1) qty = 1;
    if (qty > 100) qty = 100; // Limit
    
    ui.qty.value = qty;
    
    let result = [];
    
    if (type === 'paragraphs') {
        for (let i = 0; i < qty; i++) {
            let p = generateParagraph(i === 0);
            if (useHtml) p = `<p>${p}</p>`;
            result.push(p);
        }
        ui.output.value = result.join(useHtml ? '\n' : '\n\n');
    } 
    else if (type === 'sentences') {
        for (let i = 0; i < qty; i++) {
            result.push(generateSentence(i === 0));
        }
        ui.output.value = result.join(' ');
    }
    else if (type === 'words') {
        for (let i = 0; i < qty; i++) {
            let w = getRandomWord();
            if (i === 0) w = w.charAt(0).toUpperCase() + w.slice(1);
            result.push(w);
        }
        ui.output.value = result.join(' ') + '.';
    }
}

ui.btnGen.addEventListener('click', generateText);

ui.btnCopy.addEventListener('click', async () => {
    if (!ui.output.value) return;
    try {
        await navigator.clipboard.writeText(ui.output.value);
        showToast('Lorem Ipsum copied to clipboard!');
    } catch (err) {
        showToast('Failed to copy', 'error');
    }
});

// Initial Gen
generateText();
