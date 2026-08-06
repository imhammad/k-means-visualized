// --- DOM Elements ---
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const initBtn = document.getElementById('initBtn');
const stepBtn = document.getElementById('stepBtn');
const resetBtn = document.getElementById('resetBtn');
const statusText = document.getElementById('statusText');

// --- State Variables ---
let points = [];
let centroids = []; 
const numPoints = 200;
const pointRadius = 4;

const k = 3; 
const colors = ['#ef4444', '#3b82f6', '#10b981']; 
const centroidRadius = 8; 

// --- Helper Functions ---
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Calculate Euclidean distance between two points
function getDistance(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

// --- Core Logic ---
function spawnData() {
    points = [];
    centroids = []; 
    const padding = 20; 
    
    for (let i = 0; i < numPoints; i++) {
        points.push({
            x: getRandomInt(padding, canvas.width - padding),
            y: getRandomInt(padding, canvas.height - padding),
            cluster: -1 
        });
    }
    
    draw();
    
    statusText.innerText = "Status: Data spawned. Ready to drop centroids.";
    initBtn.innerText = "2. Drop Centroids";
    initBtn.onclick = spawnCentroids;
}

function spawnCentroids() {
    centroids = [];
    const padding = 30; 
    
    for (let i = 0; i < k; i++) {
        centroids.push({
            x: getRandomInt(padding, canvas.width - padding),
            y: getRandomInt(padding, canvas.height - padding),
            color: colors[i],
            id: i
        });
    }
    
    draw();
    
    statusText.innerText = "Status: Centroids dropped. Ready to assign points.";
    initBtn.disabled = true; 
    stepBtn.disabled = false; 
    stepBtn.innerText = "3. Assign Points";
    stepBtn.onclick = assignPoints;
}

// NEW: Calculate distances and assign clusters
function assignPoints() {
    points.forEach(p => {
        let minDistance = Infinity;
        let closestCentroid = -1;

        // Check distance to every centroid
        centroids.forEach(c => {
            let d = getDistance(p, c);
            if (d < minDistance) {
                minDistance = d;
                closestCentroid = c.id;
            }
        });

        // Assign to the closest one
        p.cluster = closestCentroid;
    });

    draw();

    // Update UI state for the next phase
    statusText.innerText = "Status: Points assigned to nearest centroid.";
    stepBtn.innerText = "4. Move Centroids";
    stepBtn.onclick = updateCentroids;
}

// Placeholder for the next step
function updateCentroids() {
    console.log("Next up: Moving centroids to the center of their clusters!");
    statusText.innerText = "Status: Centroids moved (Check console).";
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, pointRadius, 0, Math.PI * 2);
        ctx.fillStyle = p.cluster === -1 ? '#94a3b8' : colors[p.cluster];
        ctx.fill();
        ctx.closePath();
    });

    centroids.forEach(c => {
        ctx.beginPath();
        ctx.rect(c.x - centroidRadius, c.y - centroidRadius, centroidRadius * 2, centroidRadius * 2);
        ctx.fillStyle = c.color;
        ctx.fill();
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