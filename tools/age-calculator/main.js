import { getEl, showToast } from '../../src/js/utils.js';

const ui = {
    dob: getEl('dob'),
    targetDate: getEl('target-date'),
    btnCalculate: getEl('btn-calculate'),
    resultArea: getEl('result-area'),
    resultMain: getEl('result-main'),
    totalMonths: getEl('total-months'),
    totalWeeks: getEl('total-weeks'),
    totalDays: getEl('total-days'),
    nextBirthday: getEl('next-birthday')
};

// Set default target date to today
ui.targetDate.value = new Date().toISOString().split('T')[0];

ui.btnCalculate.addEventListener('click', calculateAge);

function calculateAge() {
    const dob = new Date(ui.dob.value);
    const target = new Date(ui.targetDate.value);

    if (isNaN(dob.getTime())) {
        showToast('Please enter a valid Date of Birth.', 'error');
        return;
    }
    
    if (isNaN(target.getTime())) {
        showToast('Please enter a valid Target Date.', 'error');
        return;
    }

    if (dob > target) {
        showToast('Date of Birth cannot be after the Target Date.', 'error');
        return;
    }

    let years = target.getFullYear() - dob.getFullYear();
    let months = target.getMonth() - dob.getMonth();
    let days = target.getDate() - dob.getDate();

    if (days < 0) {
        months--;
        const lastMonth = new Date(target.getFullYear(), target.getMonth(), 0);
        days += lastMonth.getDate();
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    // Main string
    let mainString = [];
    if (years > 0) mainString.push(`${years} years`);
    if (months > 0) mainString.push(`${months} months`);
    if (days > 0) mainString.push(`${days} days`);
    
    if (mainString.length === 0) ui.resultMain.textContent = "0 days old";
    else ui.resultMain.textContent = mainString.join(', ');

    // Extra Stats
    const timeDiff = target.getTime() - dob.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
    
    ui.totalMonths.textContent = (years * 12) + months;
    ui.totalWeeks.textContent = Math.floor(daysDiff / 7);
    ui.totalDays.textContent = daysDiff;

    // Next birthday
    let nextBday = new Date(dob);
    nextBday.setFullYear(target.getFullYear());
    if (nextBday < target) {
        nextBday.setFullYear(target.getFullYear() + 1);
    }
    
    const bDayDiff = Math.floor((nextBday.getTime() - target.getTime()) / (1000 * 3600 * 24));
    ui.nextBirthday.textContent = `${bDayDiff} days`;

    ui.resultArea.classList.remove('hidden');
}
