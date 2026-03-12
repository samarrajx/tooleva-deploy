import { getEl, showToast } from '../../src/js/utils.js';

const ui = {
    output: getEl('name-output'),
    selGender: getEl('sel-gender'),
    btnGenerate: getEl('btn-generate'),
    btnCopy: getEl('btn-copy'),
    box: getEl('result-box')
};

// Hardcoded lists for zero dependency
const names = {
    male: [
        "Liam", "Noah", "Oliver", "Elijah", "James", "William", "Benjamin", "Lucas", "Henry", "Theodore", "Jack",
        "Levi", "Alexander", "Jackson", "Mateo", "Daniel", "Michael", "Mason", "Sebastian", "Ethan", "Logan",
        "Owen", "Samuel", "Jacob", "Asher", "Aiden", "John", "Joseph", "Wyatt", "David", "Leo", "Luke", "Julian",
        "Hudson", "Grayson", "Matthew", "Ezra", "Gabriel", "Carter", "Isaac", "Jayden", "Luca", "Anthony", "Dylan",
        "Lincoln", "Thomas", "Maverick", "Elias", "Josiah", "Charles", "Caleb", "Christopher", "Ezekiel", "Miles",
        "Ryan", "Nathan", "Christian", "Cameron", "Hunter", "Brayden", "Arthur"
    ],
    female: [
        "Olivia", "Emma", "Charlotte", "Amelia", "Ava", "Sophia", "Isabella", "Mia", "Evelyn", "Harper", "Luna",
        "Camila", "Gianna", "Elizabeth", "Eleanor", "Ella", "Abigail", "Sofia", "Avery", "Scarlett", "Emily", "Aria",
        "Penelope", "Chloe", "Layla", "Mila", "Nora", "Hazel", "Madison", "Ellie", "Lily", "Nova", "Isla", "Grace",
        "Violet", "Aurora", "Riley", "Zoey", "Willow", "Emilia", "Stella", "Zoe", "Victoria", "Hannah", "Addison",
        "Lucy", "Eliana", "Ivy", "Everly", "Lillian", "Paisley", "Elena", "Naomi", "Maya", "Natalie", "Kinsley",
        "Delilah", "Claire", "Audrey", "Aaliyah", "Ruby", "Brooklyn", "Alice", "Ariana", "Josephine", "Quinn"
    ],
    last: [
        "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
        "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
        "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker",
        "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green", "Adams",
        "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts", "Gomez", "Phillips",
        "Evans", "Turner", "Diaz", "Parker", "Cruz", "Edwards", "Collins", "Reyes", "Stewart", "Morris", "Morales"
    ]
};

function getRandomItem(arr) {
    const arrObj = new Uint32Array(1);
    window.crypto.getRandomValues(arrObj);
    return arr[arrObj[0] % arr.length];
}

function generateName() {
    const genderChoice = ui.selGender.value;
    let firstNamesPool = [];

    if (genderChoice === 'male') {
        firstNamesPool = names.male;
    } else if (genderChoice === 'female') {
        firstNamesPool = names.female;
    } else {
        firstNamesPool = names.male.concat(names.female);
    }

    const firstName = getRandomItem(firstNamesPool);
    const lastName = getRandomItem(names.last);
    
    // Animation effect
    ui.output.style.opacity = '0';
    ui.box.style.transform = 'scale(0.98)';
    
    setTimeout(() => {
        ui.output.textContent = `${firstName} ${lastName}`;
        ui.output.style.opacity = '1';
        ui.box.style.transform = 'scale(1)';
    }, 150);
}

// Events
ui.btnGenerate.addEventListener('click', generateName);

ui.btnCopy.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(ui.output.textContent);
        showToast('Name copied to clipboard!');
    } catch (err) {
        showToast('Failed to copy text', 'error');
    }
});

// Init
generateName();
