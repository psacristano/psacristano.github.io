const canvas = document.getElementById("gameCanvas"); 
const ctx = canvas.getContext("2d");

// Dimensioni base del gioco
const baseWidth = 400;
const baseHeight = 600;

// Imposta dimensioni canvas in base allo schermo
function resizeCanvas() {
    const aspectRatio = baseWidth / baseHeight;
    
    const newHeight = window.innerHeight;

    canvas.height = newHeight;
    canvas.width = newHeight * aspectRatio;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Calcola fattore di scala per adattare dimensioni
const getScale = () => canvas.width / baseWidth;

let birdX = 50; let birdY = 150; let birdVelocity = 0; let gravity = 0.15; let jump = -5;

let pipes = []; let pipeWidth = 60; let pipeGap = 150; let pipeSpeed = 2;

let score = 0; let gameOver = false;

// Input da tastiera
document.addEventListener("keydown", (e) => { 
    e.preventDefault();
    if (!gameOver) birdVelocity = jump; 
    else restartGame(); 
});

// Input da mouse
document.addEventListener("mousedown", (e) => { 
    e.preventDefault();
    if (!gameOver) birdVelocity = jump; 
    else restartGame(); 
});

// Input da touch - supporto mobile
document.addEventListener("touchstart", (e) => {
    e.preventDefault();
    if (!gameOver) birdVelocity = jump;
    else restartGame();
}, { passive: false });

document.addEventListener("touchmove", (e) => {
    e.preventDefault();
}, { passive: false });

function spawnPipe() { 
    let topHeight = Math.random() * (canvas.height - pipeGap - 100) + 50; 
    pipes.push({ x: canvas.width, top: topHeight, bottom: topHeight + pipeGap }); 
}

setInterval(spawnPipe, 2000);

function update() {
    if (gameOver) return;

    const scale = getScale();
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    birdVelocity += gravity;
    birdY += birdVelocity;

    // Uccello ridimensionato
    const birdSize = 30 * scale;
    ctx.fillStyle = "yellow";
    ctx.fillRect(birdX * scale, birdY, birdSize, birdSize);

    ctx.fillStyle = "green";
    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;

        ctx.fillRect(pipe.x, 0, pipeWidth * scale, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, pipeWidth * scale, canvas.height - pipe.bottom);

        if (birdX * scale < pipe.x + pipeWidth * scale &&
            birdX * scale + birdSize > pipe.x &&
            (birdY < pipe.top || birdY + birdSize > pipe.bottom)) {
            endGame();
        }

        if (pipe.x + pipeWidth * scale <= birdX * scale && pipe.x + pipeWidth * scale + pipeSpeed > birdX * scale) {
            score++;
        }
    });

    if (birdY > canvas.height - birdSize || birdY < 0) endGame();

    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText(score, 10, 40);

    requestAnimationFrame(update);

}

function endGame() {
    gameOver = true; 
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
    ctx.font = "20px Arial";
    ctx.fillText("Tap to restart", canvas.width / 2, canvas.height / 2 + 40);
    ctx.textAlign = "left";
}

function restartGame() {
    birdY = 150;
    birdVelocity = 0;
    pipes = []; score = 0;
    gameOver = false;
    update();
}

update();