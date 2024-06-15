const slider = document.getElementById('gridSize');
const output = document.getElementById('sliderValue');
const container = document.getElementById('board');
const activeModeDisplay = document.getElementById('activeMode');
let rainbow = false, erase = false, fill = false;

output.textContent = `${slider.value}x${slider.value}`;

slider.addEventListener('input', () => {
    output.textContent = `${slider.value}x${slider.value}`;
    createGrid(slider.value);
});

function createGrid(size) {
    container.innerHTML = '';
    const cellSize = container.clientWidth / size;
    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement('div');
        cell.style.width = cell.style.height = `${cellSize}px`;
        cell.style.border = "1px solid #ddd";
        cell.style.boxSizing = "border-box";
        cell.addEventListener('mouseenter', changeColor);
        container.appendChild(cell);
    }
}

function changeColor(event) {
    const color = erase ? "#FFFFFF" : rainbow ? getRandomColor() : document.getElementById('brushColor').value;
    event.target.style.backgroundColor = color;
}

function getRandomColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}

function toggleMode(buttonId, modeVar) {
    const button = document.getElementById(buttonId);
    modeVar = !modeVar;
    button.classList.toggle("active", modeVar);
    updateActiveMode();
    return modeVar;
}

function rainbowMode() {
    rainbow = toggleMode('rainbowButton', rainbow);
    if (rainbow) erase = document.getElementById('eraseButton').classList.remove("active");
}

function eraseBoard() {
    erase = toggleMode('eraseButton', erase);
    if (erase) rainbow = document.getElementById('rainbowButton').classList.remove("active");
}

function clearBoard() {
    [...container.children].forEach(cell => cell.style.backgroundColor = "#FFFFFF");
    fill = false;
    updateActiveMode();
}

function fillBoard() {
    const color = document.getElementById('brushColor').value;
    [...container.children].forEach(cell => cell.style.backgroundColor = color);
    fill = true;
    updateActiveMode();
}

function adjustBrightness(color, amount) {
    const num = parseInt(color.slice(1), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, (num >> 8 & 0x00FF) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}

function changeBoardBrightness(amount) {
    [...container.children].forEach(cell => {
        const currentColor = window.getComputedStyle(cell).backgroundColor;
        cell.style.backgroundColor = adjustBrightness(rgbToHex(currentColor), amount);
    });
}

function lightenBoard() { changeBoardBrightness(20); }
function darkenBoard() { changeBoardBrightness(-20); }

function rgbToHex(rgb) {
    const [_, r, g, b] = rgb.match(/\d+/g).map(Number);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

function updateActiveMode() {
    activeModeDisplay.textContent = rainbow ? "Rainbow" : erase ? "Erase" : fill ? "Fill" : "Draw";
}

createGrid(slider.value);

document.getElementById('rainbowButton').addEventListener('click', rainbowMode);
document.getElementById('eraseButton').addEventListener('click', eraseBoard);
document.getElementById('clearButton').addEventListener('click', clearBoard);
document.getElementById('fillButton').addEventListener('click', fillBoard);
document.getElementById('lightenButton').addEventListener('click', lightenBoard);
document.getElementById('darkenButton').addEventListener('click', darkenBoard);
