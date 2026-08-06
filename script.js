// --- DOM Elements ---
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const initBtn = document.getElementById('initBtn');
const stepBtn = document.getElementById('stepBtn');
const resetBtn = document.getElementById('resetBtn');
const statusText = document.getElementById('statusText');

// --- State Variables ---
let points = [];
let centroids = []; // Array to hold our cluster centers
const numPoints = 200;
const pointRadius = 4;

// K-Means Settings
const k = 3; // Number of clusters
const colors = ['#ef4444', '#3b82f6', '#10b981']; // Red, Blue, Green
const centroidRadius = 8; // Make them bigger than data points

// --- Helper Functions ---
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// --- Core Logic ---
function spawnData() {
    points = [];
    centroids = []; // Clear any existing centroids
    const padding = 20; 
    
    for (let i = 0; i < numPoints; i++) {
        points.push({
            x: getRandomInt(padding, canvas.width - padding),
            y: getRandomInt(padding, canvas.height - padding),
            cluster: -1 // -1 means no cluster assigned yet
        });
    }
    
    draw();
    
    statusText.innerText = "Status: Data spawned. Ready to drop centroids.";
    initBtn.innerText = "2. Drop Centroids";
    initBtn.onclick = spawnCentroids;
}

function spawnCentroids() {
    centroids = [];
    const padding = 30; // Keep them slightly away from the absolute edges
    
    // Spawn 'k' centroids
    for (let i = 0; i < k; i++) {
        centroids.push({
            x: getRandomInt(padding, canvas.width - padding),
            y: getRandomInt(padding, canvas.height - padding),
            color: colors[i],
            id: i
        });
    }
    
    draw();
    
    // Update UI state
    statusText.innerText = "Status: Centroids dropped. Ready to assign points.";
    initBtn.disabled = true; // Lock the init button
    stepBtn.disabled = false; // Unlock the step button
    stepBtn.innerText = "3. Assign Points";
    stepBtn.onclick = assignPoints;
}

// Placeholder for the math step
function assignPoints() {
    console.log("Math incoming: calculating distance to nearest centroid.");
    statusText.innerText = "Status: Points assigned (Check console).";
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 1. Draw all data points
    points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, pointRadius, 0, Math.PI * 2);
        // If assigned, use centroid color. Otherwise, stay neutral gray.
        ctx.fillStyle = p.cluster === -1 ? '#94a3b8' : colors[p.cluster];
        ctx.fill();
        ctx.closePath();
    });

    // 2. Draw the centroids
    centroids.forEach(c => {
        ctx.beginPath();
        // Draw squares for centroids so they pop visually
        ctx.rect(c.x - centroidRadius, c.y - centroidRadius, centroidRadius * 2, centroidRadius * 2);
        ctx.fillStyle = c.color;
        ctx.fill();
        // Add a bold outline
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#0f172a';
        ctx.stroke();
        ctx.closePath();
    });
}

function reset() {
    points = [];
    centroids = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    statusText.innerText = "Status: Waiting to start...";
    initBtn.innerText = "1. Spawn Data";
    initBtn.disabled = false;
    initBtn.onclick = spawnData;
    
    stepBtn.disabled = true;
    stepBtn.innerText = "2. Next Step";
    stepBtn.onclick = null;
}

// --- Event Listeners ---
initBtn.onclick = spawnData;
resetBtn.onclick = reset;