import { getEl } from '../../src/js/utils.js';

const ui = {
    input: getEl('password-input'),
    btnToggle: getEl('btn-toggle-view'),
    iconEye: getEl('icon-eye'),
    iconEyeOff: getEl('icon-eye-off'),
    resultsArea: getEl('results-area'),
    scoreText: getEl('score-text'),
    timeText: getEl('time-text'),
    lengthText: getEl('length-text'),
    feedbackBox: getEl('feedback-box'),
    warningText: getEl('warning-text'),
    suggestionsList: getEl('suggestions-list'),
    bars: [getEl('bar-1'), getEl('bar-2'), getEl('bar-3'), getEl('bar-4')]
};

ui.btnToggle.addEventListener('click', () => {
    if (ui.input.type === 'password') {
        ui.input.type = 'text';
        ui.iconEye.classList.remove('hidden');
        ui.iconEyeOff.classList.add('hidden');
    } else {
        ui.input.type = 'password';
        ui.iconEye.classList.add('hidden');
        ui.iconEyeOff.classList.remove('hidden');
    }
});

const colors = [
    'bg-red-500',    // score 0, 1
    'bg-orange-500', // score 2
    'bg-yellow-500', // score 3
    'bg-emerald-500' // score 4
];

ui.input.addEventListener('input', () => {
    const val = ui.input.value;
    ui.lengthText.textContent = val.length;

    if (!val) {
        ui.resultsArea.classList.add('hidden');
        return;
    }
    
    ui.resultsArea.classList.remove('hidden');

    if (window.zxcvbn) {
        const result = window.zxcvbn(val);
        const score = result.score; // 0-4
        
        // Reset Bars
        ui.bars.forEach(b => {
             b.className = 'h-full w-1/4 rounded-full transition-all duration-300 opacity-20 bg-gray-400';
        });

        // Set Active color
        let activeColor = colors[score === 0 ? 0 : score - 1];
        if (score === 4) activeColor = colors[3];
        if (score <= 1) activeColor = colors[0];

        for (let i = 0; i <= score; i++) {
            if (i === 0 && score === 0) {
                 ui.bars[0].className = `h-full w-1/4 rounded-full transition-all duration-300 opacity-100 ${activeColor}`;
            } else if (i > 0) {
                 ui.bars[i-1].className = `h-full w-1/4 rounded-full transition-all duration-300 opacity-100 ${activeColor}`;
            }
        }

        ui.scoreText.textContent = `${score} / 4`;
        
        const crackTime = result.crack_times_display.offline_slow_hashing_1e4_per_second;
        ui.timeText.textContent = crackTime === 'centuries' ? '> centuries' : crackTime;

        if (result.feedback.warning || result.feedback.suggestions.length > 0) {
            ui.feedbackBox.classList.remove('hidden');
            ui.warningText.textContent = result.feedback.warning || 'Suggestions:';
            ui.suggestionsList.innerHTML = result.feedback.suggestions.map(s => `<li>${s}</li>`).join('');
        } else {
            ui.feedbackBox.classList.add('hidden');
        }
    }
});
