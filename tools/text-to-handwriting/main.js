import { getEl } from '../../src/js/utils.js';

const ui = {
    input: getEl('text-input'),
    font: getEl('sel-font'),
    paper: getEl('sel-paper'),
    colorBtns: document.querySelectorAll('.color-btn'),
    btnDownload: getEl('btn-download'),
    canvas: getEl('paper-canvas'),
    loading: getEl('loading')
};

const ctx = ui.canvas.getContext('2d');
let inkColor = '#1d4ed8'; // Default blue
let isFontsLoaded = false;

// Wait for Google Fonts to finish loading before drawing
document.fonts.ready.then(() => {
    isFontsLoaded = true;
    ui.loading.style.display = 'none';
    
    // Default text
    ui.input.value = "Hello there!\n\nThis is your digital text converted to realistic handwriting.\n\nType anything here to see the magic happen instantly.\n\n- Tooleva";
    drawCanvas();
});


// Event Listeners
ui.input.addEventListener('input', drawCanvas);
ui.font.addEventListener('change', drawCanvas);
ui.paper.addEventListener('change', drawCanvas);

ui.colorBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Reset rings
        ui.colorBtns.forEach(b => b.classList.remove('ring-2', 'ring-blue-500', 'ring-black', 'ring-red-600', 'ring-green-700'));
        
        // Add ring to selected
        const color = e.currentTarget.dataset.color;
        inkColor = color;
        
        let ringClass = 'ring-blue-500';
        if (color === '#111827') ringClass = 'ring-black';
        if (color === '#dc2626') ringClass = 'ring-red-600';
        if (color === '#15803d') ringClass = 'ring-green-700';
        
        e.currentTarget.classList.add('ring-2', ringClass);
        drawCanvas();
    });
});

ui.btnDownload.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'handwritten-notes.png';
    link.href = ui.canvas.toDataURL('image/png');
    link.click();
});


function drawCanvas() {
    if (!isFontsLoaded) return;
    
    const w = ui.canvas.width;
    const h = ui.canvas.height;
    
    // 1. Draw Paper Background
    ctx.clearRect(0, 0, w, h);
    
    const paperType = ui.paper.value;
    
    if (paperType === 'blank') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
    } 
    else if (paperType === 'yellow') {
        ctx.fillStyle = '#fefad2';
        ctx.fillRect(0, 0, w, h);
        drawLines('#f87171', '#9ca3af'); // red margin, gray lines
    } 
    else { // lined notebook
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
        drawLines('#f87171', '#bfdbfe'); // red margin, blue lines
    }
    
    // 2. Draw Text
    drawHandwriting();
}

function drawLines(marginColor, lineColor) {
    const w = ui.canvas.width;
    const h = ui.canvas.height;
    const lineSpacing = 40;
    const marginTop = 120;
    const marginLeft = 100;
    
    // Horizontal Lines
    ctx.lineWidth = 1;
    ctx.strokeStyle = lineColor;
    for (let y = marginTop; y < h; y += lineSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
    }
    
    // Vertical Margin Line (Double or Single)
    ctx.strokeStyle = marginColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(marginLeft, 0);
    ctx.lineTo(marginLeft, h);
    ctx.stroke();
}

function drawHandwriting() {
    const text = ui.input.value;
    if (!text) return;
    
    const fontName = ui.font.value;
    // Adjust font size based on the chosen font
    let fontSize = 36; 
    let lineSpacing = 40; // match paper lines
    let yOffset = -5; // adjustment to sit on the line
    
    if (fontName.includes('Caveat')) { fontSize = 38; yOffset = -5; }
    if (fontName.includes('Indie')) { fontSize = 30; yOffset = -10; }
    if (fontName.includes('Shadows')) { fontSize = 32; yOffset = -10; }
    if (fontName.includes('Apple')) { fontSize = 24; yOffset = -15; }
    
    ctx.font = `${fontSize}px ${fontName}`;
    ctx.fillStyle = inkColor;
    ctx.textBaseline = 'bottom'; // Draw sitting ON the line
    
    const startX = 120; // past margin
    const startY = 120; // first line Y
    const maxWidth = ui.canvas.width - startX - 40; // right padding
    
    const paragraphs = text.split('\n');
    let currentLineY = startY;
    
    for (let para of paragraphs) {
        if (para === '') {
            // empty line
            currentLineY += lineSpacing;
            continue;
        }
        
        // Word wrap standard approach
        const words = para.split(' ');
        let line = '';
        
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && n > 0) {
                // Draw current line
                ctx.fillText(line, startX, currentLineY + yOffset);
                line = words[n] + ' ';
                currentLineY += lineSpacing;
            } else {
                line = testLine;
            }
        }
        
        // Draw remainder
        ctx.fillText(line, startX, currentLineY + yOffset);
        currentLineY += lineSpacing;
    }
}
