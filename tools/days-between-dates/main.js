import { getEl, showToast } from '../../src/js/utils.js';

const ui = {
    start: getEl('start-date'),
    end: getEl('end-date'),
    
    btnCalc: getEl('btn-calculate'),
    btnToday: getEl('btn-today'),
    
    resDays: getEl('result-days'),
    resYmd: getEl('res-ymd'),
    resWeeks: getEl('res-weeks'),
    resHours: getEl('res-hours')
};

// Initialize with today's date
setToday();

ui.btnToday.addEventListener('click', setToday);
ui.btnCalc.addEventListener('click', calculateDates);

// Allow Enter key to calculate
[ui.start, ui.end].forEach(input => {
    input.addEventListener('change', calculateDates);
});

function setToday() {
    const today = dayjs().format('YYYY-MM-DD');
    ui.start.value = today;
    
    // Set End Date to 30 days from now as default
    ui.end.value = dayjs().add(30, 'day').format('YYYY-MM-DD');
    calculateDates();
}

function calculateDates() {
    if (!ui.start.value || !ui.end.value) {
        showToast('Please select both a start and end date.', 'error');
        return;
    }

    const d1 = dayjs(ui.start.value);
    const d2 = dayjs(ui.end.value);
    
    // Total Days Diff absolute
    const totalDays = Math.abs(d2.diff(d1, 'day'));
    const totalHours = Math.abs(d2.diff(d1, 'hour'));
    
    // Weeks and Days
    const weeks = Math.floor(totalDays / 7);
    const remainingDays = totalDays % 7;
    
    // Years, Months, Days
    const earlyDate = d1.isBefore(d2) ? d1 : d2;
    const laterDate = d1.isBefore(d2) ? d2 : d1;
    
    const years = laterDate.diff(earlyDate, 'year');
    const dateAfterYears = earlyDate.add(years, 'year');
    const months = laterDate.diff(dateAfterYears, 'month');
    const dateAfterMonths = dateAfterYears.add(months, 'month');
    const days = laterDate.diff(dateAfterMonths, 'day');

    updateDisplay(totalDays, years, months, days, weeks, remainingDays, totalHours);
}

function updateDisplay(total, y, m, d, w, rd, h) {
    ui.resDays.textContent = total.toLocaleString();
    ui.resYmd.textContent = `${y}Y, ${m}M, ${d}D`;
    ui.resWeeks.textContent = `${w} Weeks, ${rd} Days`;
    ui.resHours.textContent = `${h.toLocaleString()} Hours`;
}
