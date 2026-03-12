import { getEl, showToast } from '../../src/js/utils.js';

const ui = {
    input: getEl('text-input'),
    btnCopy: getEl('btn-copy'),
    btnClear: getEl('btn-clear'),
    
    btnUpper: getEl('btn-uppercase'),
    btnLower: getEl('btn-lowercase'),
    btnCap: getEl('btn-capitalize'),

    statWords: getEl('stat-words'),
    statChars: getEl('stat-chars'),
    statSentences: getEl('stat-sentences'),
    statParagraphs: getEl('stat-paragraphs'),
    statCharsNoSpaces: getEl('stat-chars-nospaces'),
    statReading: getEl('stat-reading'),
    statSpeaking: getEl('stat-speaking'),
};

ui.input.addEventListener('input', updateStats);

ui.btnClear.addEventListener('click', () => {
    ui.input.value = '';
    updateStats();
    ui.input.focus();
});

ui.btnCopy.addEventListener('click', async () => {
    if (!ui.input.value) return;
    try {
        await navigator.clipboard.writeText(ui.input.value);
        showToast('Text copied to clipboard!');
    } catch (err) {
        showToast('Failed to copy', 'error');
    }
});

ui.btnUpper.addEventListener('click', () => {
    ui.input.value = ui.input.value.toUpperCase();
    updateStats();
});

ui.btnLower.addEventListener('click', () => {
    ui.input.value = ui.input.value.toLowerCase();
    updateStats();
});

ui.btnCap.addEventListener('click', () => {
    ui.input.value = ui.input.value.replace(/\b\w/g, c => c.toUpperCase());
    updateStats();
});

function updateStats() {
    const text = ui.input.value;
    
    // Characters
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    
    // Words
    const wordsMatch = text.match(/\b\w+\b/g);
    const words = wordsMatch ? wordsMatch.length : 0;
    
    // Sentences
    const sentencesMatch = text.match(/[^\.!\?]+[\.!\?]+/g);
    const sentences = sentencesMatch ? sentencesMatch.length : 0;
    
    // Paragraphs
    const paragraphsMatch = text.replace(/\n$/gm, '').split(/\n/);
    const paragraphs = text.trim() === '' ? 0 : paragraphsMatch.length;
    
    // Reading time (avg 225 wpm)
    const readingTime = Math.ceil(words / 225);
    
    // Speaking time (avg 130 wpm)
    const speakingTime = Math.ceil(words / 130);
    
    // Update DOM
    ui.statChars.textContent = chars.toLocaleString();
    ui.statCharsNoSpaces.textContent = charsNoSpaces.toLocaleString();
    ui.statWords.textContent = words.toLocaleString();
    ui.statSentences.textContent = sentences.toLocaleString();
    ui.statParagraphs.textContent = paragraphs.toLocaleString();
    
    ui.statReading.textContent = `~${readingTime} min`;
    ui.statSpeaking.textContent = `~${speakingTime} min`;
}

// Initial calculation
updateStats();
