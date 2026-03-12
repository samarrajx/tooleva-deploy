import { getEl } from '../../src/js/utils.js';

const ui = {
    regexInput: getEl('regex-input'),
    regexFlags: getEl('regex-flags'),
    testInput: getEl('test-input'),
    testOutput: getEl('test-output'),
    errorMsg: getEl('error-msg'),
    matchCount: getEl('match-count')
};

// Default test sample
const DEF_INPUT = `Welcome to Tooleva Regex Tester!
Emails: test@example.com, hello@world.org
Phone: (123) 456-7890
Numbers: 42, 3.1415, -10
Date: 2023-10-27`;

ui.testInput.value = DEF_INPUT;

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }

function executeRegex() {
    const pattern = ui.regexInput.value;
    const flags = ui.regexFlags.value;
    const text = ui.testInput.value;

    if (!pattern) {
        ui.testOutput.innerHTML = escapeHtml(text);
        ui.matchCount.textContent = '0 matches';
        ui.errorMsg.classList.add('hidden');
        return;
    }

    let regex;
    try {
        regex = new RegExp(pattern, flags);
        ui.errorMsg.classList.add('hidden');
    } catch(e) {
        ui.errorMsg.classList.remove('hidden');
        ui.errorMsg.textContent = e.message;
        ui.testOutput.innerHTML = escapeHtml(text);
        ui.matchCount.textContent = '0 matches';
        return;
    }

    if (!regex.global && text.match(regex)) {
        // If not global, it only matches once, making highlighting tricky for replacements
        // We'll mimic global for highlighting but report correctly if they didn't use g.
        // Actually, just using a match loop is better if we want to extract
    }

    try {
        let count = 0;
        let altColor = false;
        
        // We will rebuild the HTML string segment by segment to avoid HTML injection
        // when highlighting matches.
        let resultHtml = '';
        let lastIndex = 0;
        
        // Ensure regex is global if we want to loop all matches safely to build highlighter
        const safeRegex = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');

        let match;
        // Limit iterations to prevent infinite loops on zero-length matches (like ^ or $)
        let iterations = 0; 
        
        while ((match = safeRegex.exec(text)) !== null) {
            iterations++;
            if (iterations > 5000) break; 
            
            // Prevent infinite loops on empty matches
            if (match.index === safeRegex.lastIndex) {
                 safeRegex.lastIndex++;
            }

            count++;
            
            // Text before match
            resultHtml += escapeHtml(text.substring(lastIndex, match.index));
            
            // The match itself
            const matchText = match[0];
            const cls = altColor ? 'match-highlight alt' : 'match-highlight';
            altColor = !altColor;
            
            resultHtml += `<span class="${cls}">${escapeHtml(matchText)}</span>`;
            
            lastIndex = match.index + matchText.length;
            
            if (!flags.includes('g')) {
                 break; // Only one match if g flag is missing
            }
        }
        
        // Append remainder
        resultHtml += escapeHtml(text.substring(lastIndex));

        ui.testOutput.innerHTML = resultHtml;
        ui.matchCount.textContent = `${count} matches`;

    } catch(e) {
         ui.testOutput.innerHTML = escapeHtml(text);
         ui.matchCount.textContent = 'Error during execution';
    }
}

ui.regexInput.addEventListener('input', executeRegex);
ui.regexFlags.addEventListener('input', executeRegex);
ui.testInput.addEventListener('input', executeRegex);

// Init
executeRegex();
