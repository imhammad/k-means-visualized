// --- DOM Elements ---
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const initBtn = document.getElementById('initBtn');
const stepBtn = document.getElementById('stepBtn');
const resetBtn = document.getElementById('resetBtn');
const statusText = document.getElementById('statusText');

// --- State Variables ---
let points = [];
const numPoints = 200; // Number of dots on screen
const pointRadius = 4;


// Generates a random number within a specific range
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// --- Core Logic ---
// 1. Generate random data points across the canvas
function spawnData() {
    points = [];
    
    // Add padding so points don't spawn right on the border
    const padding = 20; 
    
    for (let i = 0; i < numPoints; i++) {
        points.push({
            x: getRandomInt(padding, canvas.width - padding),
            y: getRandomInt(padding, canvas.height - padding),
            cluster: -1 // -1 means no cluster assigned yet
        });
    }
    
    draw();
    
    // Update UI state
    statusText.innerText = "Status: Data spawned. Ready to drop centroids.";
    initBtn.innerText = "2. Drop Centroids";
    initBtn.onclick = spawnCentroids; // Change button action for the next step
}

function spawnCentroids() {
    console.log("Centroids will spawn next!");
    statusText.innerText = "Status: Centroids dropped (Check console).";
}

// Draw the current state to the canvas
function draw() {
    // Clear the canvas for the new frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw all data points
    points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, pointRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#94a3b8'; // Neutral slate gray for unassigned points
        ctx.fill();
        ctx.closePath();
    });
}

// Reset everything to the initial state
function reset() {
    points = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    statusText.innerText = "Status: Waiting to start...";
    initBtn.innerText = "1. Spawn Data";
    initBtn.onclick = spawnData;
    
    stepBtn.disabled = true;
}

// --- Event Listeners ---
initBtn.onclick = spawnData;
resetBtn.onclick = reset;