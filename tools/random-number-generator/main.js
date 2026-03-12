import { getEl, showToast } from '../../src/js/utils.js';

const ui = {
    min: getEl('num-min'),
    max: getEl('num-max'),
    output: getEl('number-output'),
    btnGenerate: getEl('btn-generate'),
    btnCopy: getEl('btn-copy')
};

// Easing function for visual roll effect
const easeOutQuart = t => 1 - (--t) * t * t * t;

// Gets a cryptographically secure random integer between min and max (inclusive)
function secureRandomInt(min, max) {
    const range = max - min + 1;
    const bytesNeeded = Math.ceil(Math.log2(range) / 8);
    const maxVal = Math.pow(256, bytesNeeded);
    const limit = maxVal - (maxVal % range);
    
    let randomVal;
    do {
        const arr = new Uint8Array(bytesNeeded);
        window.crypto.getRandomValues(arr);
        randomVal = 0;
        for (let i = 0; i < bytesNeeded; i++) {
            randomVal = (randomVal << 8) + arr[i];
        }
    } while (randomVal >= limit);
    
    return min + (randomVal % range);
}

function generate() {
    let min = parseInt(ui.min.value);
    let max = parseInt(ui.max.value);

    // Swap if max is less than min
    if (min > max) {
        const temp = min;
        min = max;
        max = temp;
        ui.min.value = min;
        ui.max.value = max;
    }

    if (isNaN(min)) min = 0;
    if (isNaN(max)) max = 100;

    const targetNum = secureRandomInt(min, max);
    
    // Animation Roll Effect
    const duration = 800;
    const startNum = parseInt(ui.output.textContent) || 0;
    const startTime = performance.now();

    function animate(currentTime) {
        let elapsed = currentTime - startTime;
        let progress = Math.min(elapsed / duration, 1);
        
        let easedProgress = easeOutQuart(progress);
        
        let currentNum = Math.floor(startNum + (targetNum - startNum) * easedProgress);
        
        // Random scramble during the roll
        if (progress < 0.9) {
            ui.output.textContent = secureRandomInt(min, max);
        } else {
            ui.output.textContent = currentNum;
        }

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            ui.output.textContent = targetNum;
        }
    }
    
    requestAnimationFrame(animate);
}

ui.btnGenerate.addEventListener('click', generate);

ui.btnCopy.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(ui.output.textContent);
        showToast('Number copied!');
    } catch (err) {
        showToast('Failed to copy', 'error');
    }
});

// Init
generate();
