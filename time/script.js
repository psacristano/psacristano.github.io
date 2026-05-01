const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const hourSelect = document.getElementById("hour");
const minuteSelect = document.getElementById("minute");
const tryButton = document.getElementById("tryButton");
const restartButton = document.getElementById("restartButton");
const copyButton = document.getElementById("copyButton");
const message = document.getElementById("message");

// Puzzle demo.
const puzzle = {
    number: 1,
    title: "Il momento sospeso",
    answerHour: 20,
    answerMinute: 17,
    tolerance: 10,
    eventName: "Evento demo ispirato allo sbarco sulla Luna",
    finalText: "L'idea è che ogni giorno l'utente debba trovare l'ora collegata a un evento reale. Gli indizi non devono regalare subito la risposta: devono creare tensione.",
    clues: [
        "Una sera, il mondo rimase davanti agli schermi. Qualcosa stava accadendo lontano dalla Terra.",
        "Il segnale arrivava dallo spazio. Una frase sarebbe entrata nella memoria collettiva.",
        "L'uomo era già sceso. Ora devi trovare il momento legato alle prime parole pronunciate sulla superficie lunare."
    ]
};

let attempts = 0;
let maxAttempts = 3;
let gameOver = false;
let lastGuess = null;
let currentMessage = "Indovina l'ora nascosta. Hai 3 tentativi.";
let resultText = "";

function fillSelects() {
    for (let i = 0; i < 24; i++) {
        let option = document.createElement("option");
        option.value = i;
        option.textContent = String(i).padStart(2, "0");
        hourSelect.appendChild(option);
    }

    for (let i = 0; i < 60; i += 5) {
        let option = document.createElement("option");
        option.value = i;
        option.textContent = String(i).padStart(2, "0");
        minuteSelect.appendChild(option);
    }

    hourSelect.value = 20;
    minuteSelect.value = 0;
}

function timeToMinutes(hour, minute) {
    return hour * 60 + minute;
}

function getCircularDistance(a, b) {
    let diff = Math.abs(a - b);
    return Math.min(diff, 1440 - diff);
}

function getSignedDistance(guess, answer) {
    let diff = guess - answer;

    if (diff > 720) {
        diff -= 1440;
    }

    if (diff < -720) {
        diff += 1440;
    }

    return diff;
}

function drawRoundedRect(x, y, width, height, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    ctx.fill();
}

function drawText(text, x, y, maxWidth, lineHeight, color, size, align = "center") {
    ctx.fillStyle = color;
    ctx.font = size + "px Arial";
    ctx.textAlign = align;

    let words = text.split(" ");
    let line = "";
    let lines = [];

    for (let i = 0; i < words.length; i++) {
        let testLine = line + words[i] + " ";
        let testWidth = ctx.measureText(testLine).width;

        if (testWidth > maxWidth && i > 0) {
            lines.push(line);
            line = words[i] + " ";
        } else {
            line = testLine;
        }
    }

    lines.push(line);

    for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i].trim(), x, y + i * lineHeight);
    }

    return lines.length * lineHeight;
}

function drawClock() {
    let cx = canvas.width / 2;
    let cy = 230;
    let radius = 115;

    ctx.save();

    // Cerchio esterno
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = "#10131d";
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#f5c84b";
    ctx.stroke();

    // Tacche
    for (let i = 0; i < 60; i++) {
        let angle = (i * 6 - 90) * Math.PI / 180;
        let outer = radius - 8;
        let inner = i % 5 === 0 ? radius - 22 : radius - 15;

        let x1 = cx + Math.cos(angle) * outer;
        let y1 = cy + Math.sin(angle) * outer;
        let x2 = cx + Math.cos(angle) * inner;
        let y2 = cy + Math.sin(angle) * inner;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineWidth = i % 5 === 0 ? 3 : 1;
        ctx.strokeStyle = i % 5 === 0 ? "#f5c84b" : "#4a5068";
        ctx.stroke();
    }

    // Numeri principali
    ctx.fillStyle = "#ffffff";
    ctx.font = "22px Arial";
    ctx.textAlign = "center";
    ctx.fillText("12", cx, cy - 78);
    ctx.fillText("3", cx + 78, cy + 8);
    ctx.fillText("6", cx, cy + 92);
    ctx.fillText("9", cx - 78, cy + 8);

    // Centro senza lancette
    ctx.beginPath();
    ctx.arc(cx, cy, 7, 0, Math.PI * 2);
    ctx.fillStyle = "#f5c84b";
    ctx.fill();

    // Disegna le lancette solo dopo un tentativo
    if (lastGuess !== null) {
        let hour = lastGuess.hour;
        let minute = lastGuess.minute;

        let minuteAngle = (minute * 6 - 90) * Math.PI / 180;
        let hourAngle = (((hour % 12) * 30) + minute * 0.5 - 90) * Math.PI / 180;

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(hourAngle) * 58, cy + Math.sin(hourAngle) * 58);
        ctx.lineWidth = 7;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#f5c84b";
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(minuteAngle) * 82, cy + Math.sin(minuteAngle) * 82);
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#ff7a59";
        ctx.stroke();
    }

    ctx.restore();
}

function drawAttempts() {
    let startX = 138;
    let y = 395;

    for (let i = 0; i < maxAttempts; i++) {
        ctx.beginPath();
        ctx.arc(startX + i * 42, y, 9, 0, Math.PI * 2);
        ctx.fillStyle = i < attempts ? "#ff7a59" : "#3a4057";
        ctx.fill();
    }
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Sfondo
    ctx.fillStyle = "#171b29";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Header
    drawText("ORA X", canvas.width / 2, 42, 300, 30, "#f5c84b", 34);
    drawText("Caso #" + String(puzzle.number).padStart(3, "0"), canvas.width / 2, 75, 300, 20, "#c7cada", 15);

    // Box indizio
    drawRoundedRect(25, 95, 310, 82, 14, "#202638");

    let clueIndex = Math.min(attempts, puzzle.clues.length - 1);
    drawText(puzzle.clues[clueIndex], canvas.width / 2, 122, 275, 19, "#ffffff", 15);

    drawClock();
    drawAttempts();

    // Messaggio feedback
    drawRoundedRect(25, 420, 310, 75, 14, "#10131d");
    drawText(currentMessage, canvas.width / 2, 448, 280, 20, "#d8d9e4", 15);
}

function makeGuess() {
    if (gameOver) {
        return;
    }

    let guessHour = Number(hourSelect.value);
    let guessMinute = Number(minuteSelect.value);

    lastGuess = {
        hour: guessHour,
        minute: guessMinute
    };

    attempts++;

    let guessTotal = timeToMinutes(guessHour, guessMinute);
    let answerTotal = timeToMinutes(puzzle.answerHour, puzzle.answerMinute);

    let distance = getCircularDistance(guessTotal, answerTotal);
    let signedDistance = getSignedDistance(guessTotal, answerTotal);

    if (distance <= puzzle.tolerance) {
        currentMessage = "Corretto. Hai trovato la zona dell'Ora X.";
        resultText = "Risolto in " + attempts + "/3";
        endGame(true);
    } else {
        let direction = signedDistance < 0 ? "troppo presto" : "troppo tardi";

        if (distance <= 20) {
            currentMessage = "Brivido: sei vicinissimo, ma " + direction + ".";
        } else if (distance <= 45) {
            currentMessage = "Sei vicino, ma sei " + direction + ".";
        } else if (distance <= 120) {
            currentMessage = "La fascia è credibile, ma sei " + direction + ".";
        } else {
            currentMessage = "Fuori strada: sei " + direction + ".";
        }

        if (attempts >= maxAttempts) {
            resultText = "Non risolto";
            endGame(false);
        }
    }

    message.textContent = currentMessage;
    drawGame();
}

function endGame(won) {
    gameOver = true;
    tryButton.disabled = true;

    let answer = String(puzzle.answerHour).padStart(2, "0") + ":" + String(puzzle.answerMinute).padStart(2, "0");

    if (won) {
        message.textContent = "Hai vinto. L'Ora X era " + answer + ". " + puzzle.finalText;
    } else {
        message.textContent = "Tentativi finiti. L'Ora X era " + answer + ". " + puzzle.finalText;
    }
}

function restartGame() {
    attempts = 0;
    gameOver = false;
    lastGuess = null;
    currentMessage = "Indovina l'ora nascosta. Hai 3 tentativi.";
    resultText = "";
    tryButton.disabled = false;
    hourSelect.value = 20;
    minuteSelect.value = 0;
    message.textContent = currentMessage;
    drawGame();
}

function copyResult() {
    let answer = String(puzzle.answerHour).padStart(2, "0") + ":" + String(puzzle.answerMinute).padStart(2, "0");

    let text = "ORA X #" + String(puzzle.number).padStart(3, "0") + "\n" +
        (resultText || "Partita in corso") + "\n" +
        "Ora nascosta: " + answer + "\n" +
        "Hai solo 3 tentativi per trovarla.";

    navigator.clipboard.writeText(text).then(function() {
        message.textContent = "Risultato copiato negli appunti.";
    }).catch(function() {
        message.textContent = text;
    });
}

fillSelects();
drawGame();

tryButton.addEventListener("click", makeGuess);
restartButton.addEventListener("click", restartGame);
copyButton.addEventListener("click", copyResult);
