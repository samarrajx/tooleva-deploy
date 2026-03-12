import { getEl, showToast } from '../../src/js/utils.js';

const ui = {
    inputFrom: getEl('input-from'),
    inputTo: getEl('input-to'),
    selFrom: getEl('sel-from'),
    selTo: getEl('sel-to'),
    diffText: getEl('diff-text'),
    btnCopy: getEl('btn-copy')
};

// Common Timezones
const commonZones = [
    "UTC",
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Asia/Dubai",
    "Asia/Kolkata",
    "Asia/Singapore",
    "Asia/Tokyo",
    "Australia/Sydney",
    "Pacific/Auckland"
];

const guessedZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

function populateZones() {
    let html = '';
    
    // Check if guessed zone is in commonZones, if not add it
    if (!commonZones.includes(guessedZone) && guessedZone) {
        commonZones.unshift(guessedZone);
    }

    commonZones.forEach(zone => {
        html += `<option value="${zone}">${zone.replace(/_/g, ' ')}</option>`;
    });

    ui.selFrom.innerHTML = html;
    ui.selTo.innerHTML = html;

    // Set defaults
    ui.selFrom.value = guessedZone || 'UTC';
    ui.selTo.value = 'UTC';
}

function convert() {
    const rawVal = ui.inputFrom.value;
    if (!rawVal) {
        ui.inputTo.value = '';
        ui.diffText.textContent = '';
        return;
    }

    const fromTz = ui.selFrom.value;
    const toTz = ui.selTo.value;

    try {
        // Create date object interpreting the raw input as the source timezone.
        // Javascript dates don't natively let you say "parse '2023-10-27T10:00' AS Asia/Tokyo".
        // A simple trick using Intl and offset logic:
        
        // 1. We treat the input string as absolute local time.
        // Easiest reliable cross-browser way without Moment/Luxon is to format it explicitly
        const dtSrcStr = new Date(rawVal).toLocaleString("en-US", { timeZone: fromTz });
        const dtTargetStr = new Date(rawVal).toLocaleString("en-US", { timeZone: toTz });

        // Since native APIs make this very complex to do perfectly (given DST rules etc), 
        // we will use a known approach: construct UTC from the local string offsets.
        // However, Vite+Vanilla means we want zero deps if possible.
        // We will utilize dayjs via CDN!
        
        if (window.dayjs && window.dayjs.extend) {
             const fromDate = dayjs.tz(rawVal, fromTz);
             const targetDate = fromDate.tz(toTz);
             
             ui.inputTo.value = targetDate.format('YYYY-MM-DD HH:mm:ss (Z)');
             
             const diffMins = (targetDate.utcOffset() - fromDate.utcOffset());
             const diffHrs = diffMins / 60;
             const sign = diffHrs > 0 ? '+' : '';
             
             ui.diffText.textContent = `${toTz.split('/').pop().replace('_', ' ')} is ${sign}${diffHrs} hours compared to ${fromTz.split('/').pop().replace('_', ' ')}.`;
        }
    } catch(err) {
        console.error(err);
    }
}

// Inject Day.js for reliable TZ handling
function injectDayjs() {
    return new Promise((resolve) => {
        const s1 = document.createElement('script');
        s1.src = "https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js";
        s1.onload = () => {
            const s2 = document.createElement('script');
            s2.src = "https://cdn.jsdelivr.net/npm/dayjs@1/plugin/utc.js";
            s2.onload = () => {
                const s3 = document.createElement('script');
                s3.src = "https://cdn.jsdelivr.net/npm/dayjs@1/plugin/timezone.js";
                s3.onload = () => {
                    dayjs.extend(window.dayjs_plugin_utc);
                    dayjs.extend(window.dayjs_plugin_timezone);
                    resolve();
                };
                document.head.appendChild(s3);
            };
            document.head.appendChild(s2);
        };
        document.head.appendChild(s1);
    });
}


async function init() {
    populateZones();
    
    // Set current local time as default input
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    ui.inputFrom.value = now.toISOString().slice(0,16);

    await injectDayjs();
    convert();
    
    ui.inputFrom.addEventListener('input', convert);
    ui.selFrom.addEventListener('change', convert);
    ui.selTo.addEventListener('change', convert);

    ui.btnCopy.addEventListener('click', async () => {
        if (!ui.inputTo.value) return;
        try {
            await navigator.clipboard.writeText(ui.inputTo.value);
            showToast('Result copied!');
        } catch(err) {
            showToast('Failed to copy', 'error');
        }
    });
}

init();
