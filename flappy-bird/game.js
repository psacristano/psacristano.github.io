const canvas = document.getElementById("gameCanvas"); 
const ctx = canvas.getContext("2d");

// Risoluzione interna fissa (non cambiare)
canvas.width = 400;
canvas.height = 600;

let birdX = 50; let birdY = 150; let birdVelocity = 0; let gravity = 0.25; let jump = -6;

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

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    birdVelocity += gravity;
    birdY += birdVelocity;

    ctx.fillStyle = "yellow";
    ctx.fillRect(birdX, birdY, 30, 30);

    ctx.fillStyle = "green";
    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;

        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, pipeWidth, canvas.height - pipe.bottom);

        if (birdX < pipe.x + pipeWidth &&
            birdX + 30 > pipe.x &&
            (birdY < pipe.top || birdY + 30 > pipe.bottom)) {
            endGame();
        }

        if (pipe.x + pipeWidth <= birdX && pipe.x + pipeWidth + pipeSpeed > birdX) {
            score++;
        }
    });

    if (birdY > canvas.height - 30 || birdY < 0) endGame();

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