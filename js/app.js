let gameOver = false;
let gameStarted = false;
let score = 0;
let paused = true;
let currentDirection = 'ArrowRight'; // default starting direction
const sounds = {};

const reset = document.querySelector("#resetButton");
const pause = document.querySelector("#pauseButton");
const scoreCount = document.querySelector("#score");
const gameMessage = document.querySelector('#message');
const restart = document.querySelector('#restartButton');

const modal = document.getElementById('gameModal');
const closeModal = document.getElementById('closeModal');
const startButton = document.getElementById('startGame');

const playAgain = document.getElementById('playAgain');
const closeWin = document.getElementById('closeWinGameModal');
const winModal = document.getElementById('winModal');
const finalScore = document.getElementById('finalScore');

// Runs once automatically when the page finishes loading
document.addEventListener('DOMContentLoaded', () => {
    modal.style.display = 'flex';
});

winModal.style.display = 'none';

const checkWinner = () => {
    if (score >= 80) {
        winModal.style.display = "flex";
        finalScore.textContent = score;
        pauseGame();
    }
};

// Runs everytime the button is clicked
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    startGameLoop();
});

startButton.addEventListener('click', () => {
    modal.style.display = 'none';
    startGameLoop(); // start cleanly
});

closeWin.addEventListener('click', () => {
    winModal.style.display = 'none';
    startGameLoop();
});

playAgain.addEventListener('click', () => {
    winModal.style.display = 'none';
    resetGame();
    startGameLoop();
});

const direction = document.querySelectorAll('#id');

// Select gameGrid for Html, grid represents container where all game cells are placed 
const grid = document.getElementById("gameGrid");

// set the total num of cells in game grid
const totalCells = 20 * 20;

// create and append cells to the grid
for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.id = i;
    grid.appendChild(cell);
}

// This gives us a nodelist, so an array like collection of every cell div in the grid
const cells = document.querySelectorAll(".cell");

// Random start position for Snake and Food
const randomSnake = Math.floor(Math.random() * totalCells);
const randomFood = Math.floor(Math.random() * totalCells);

// Find the cell at position randomsnake/food inside the grid and add the class snake / food to it so we can visualise
cells[randomSnake].classList.add('snake');
cells[randomFood].classList.add('food');

let snake = [randomSnake];
let foodIndex = randomFood;

// ---------------------- Keydown for direction change -----------------------
// keydown on the randomSnake event so that we can move it once initialised
document.addEventListener('keydown', (event) => {
    const allowedDirections = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    if (allowedDirections.includes(event.key)) {

        // Prevent reversing direction directly, prevents the snake from reversing into itself
        if (
            (event.key === 'ArrowUp' && currentDirection !== 'ArrowDown') ||
            (event.key === 'ArrowDown' && currentDirection !== 'ArrowUp') ||
            (event.key === 'ArrowLeft' && currentDirection !== 'ArrowRight') ||
            (event.key === 'ArrowRight' && currentDirection !== 'ArrowLeft')
        ) {
            // if all checks pass, this line changes the snakes directions
            currentDirection = event.key;
        }
    }
});

// ------------------------ Reset Game Function -----------------------------
const resetGame = () => {
    snake.forEach(index => cells[index].classList.remove('snake'));
    const randomSnake = Math.floor(Math.random() * totalCells);
    snake = [randomSnake];
    cells[randomSnake].classList.add('snake');

    cells[foodIndex].classList.remove('food');
    const randomFood = Math.floor(Math.random() * totalCells);
    foodIndex = randomFood;
    cells[foodIndex].classList.add('food');

    score = 0;
    scoreCount.textContent = `Score: ${score}`;

    gameOver = false;
};

const checkGameOver = (newHead, key) => {
    // If the head moves off the top or bottom
    if (
        newHead < 0 || newHead >= totalCells ||
        (newHead % 20 === 0 && key === "ArrowRight") ||
        (newHead % 20 === 19 && key === "ArrowLeft")
    )
        return true; // game over
};

// Move Snake Function
let gameInterval;
const speed = 300; // move every 300ms

const moveSnake = () => {
    if (gameOver) return;

    let newHead = snake[0];

    // Move in currentDirection
    switch (currentDirection) {
        case 'ArrowUp':
            newHead -= 20;
            break;
        case 'ArrowDown':
            newHead += 20;
            break;
        case 'ArrowLeft':
            newHead -= 1;
            break;
        case 'ArrowRight':
            newHead += 1;
            break;
    }

    if (checkGameOver(newHead, currentDirection)) {
        gameOver = true;
        gameMessage.classList.remove("hidden");
        playSound('gameover');
        clearInterval(gameInterval); // stop the game
        return;
    }

    snake.forEach(index => cells[index].classList.remove('snake'));
    snake.unshift(newHead);

    if (newHead === foodIndex) {
        playSound('food');
        cells[foodIndex].classList.remove('food');
        foodIndex = Math.floor(Math.random() * totalCells);
        cells[foodIndex].classList.add('food');
        score += 10;
        scoreCount.textContent = `Score: ${score}`;

        checkWinner();

    } else {
        snake.pop();
    }

    snake.forEach(index => cells[index].classList.add('snake'));
};

const startGameLoop = () => {
    playSound('background');
    clearInterval(gameInterval); // stop any existing loop
    gameInterval = setInterval(moveSnake, speed); // start fresh
    paused = false;
    pause.textContent = 'Pause';
};

const restartGame = () => {
    resetGame();
    gameMessage.classList.add("hidden");
    currentDirection = 'ArrowRight'; // reset direction
    startGameLoop(); // restart properly
    playSound('background');
};

const pauseGame = () => {
    if (!paused) {
        clearInterval(gameInterval);
        paused = true;
        pause.textContent = 'Play';
        pauseSound('background');

    } else {
        startGameLoop(); // use our helper instead of another interval
        playSound('background');
    }
};

// create sound effects 
const playSound = (type) => {
    // sounds[type] stores the Audio object.
    // If it already exists, it reuses it (so I don’t create multiple objects for the same sound).
    if (!sounds[type]) {
        sounds[type] = new Audio(`assets/sounds/${type}.mp3`);
    }
    sounds[type].play();
};

// if (sounds[type]) is a safety check to make sure the sound exists before calling .pause()
const pauseSound = (type) => {
    if (sounds[type]) sounds[type].pause();
};

reset.addEventListener('click', resetGame);
pause.addEventListener('click', pauseGame);
restart.addEventListener('click', restartGame);
