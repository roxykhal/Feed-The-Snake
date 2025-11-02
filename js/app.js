/*---------------------------- Variables (state) ----------------------------*/

let gameOver = false;
let gameStarted = false;
let score = 0;
let timerStarted = false;
let winTimer;


/*------------------------ Cached Element References ------------------------*/
const reset = document.querySelector("#resetButton");
const pause = document.querySelector("#pauseButton");
const scoreCount = document.querySelector("#score");
const gameMessage = document.querySelector('#message');
const timerMessage = document.querySelector('#timerMessage')
// const direction = document.querySelectorAll('#id');

//Select gameGrid for Html, grid represents container where all game cells are placed 
const grid = document.getElementById("gameGrid");

//set the total num of cells in game grid
const totalCells = 20 * 20;

//create and append cells to the grid
for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.id = i;
    grid.appendChild(cell);
};

//This gives us a nodelist, so an array like collection of every cell div in the grid
const cells = document.querySelectorAll(".cell");

//Random start position for Snake and Food
const randomSnake = Math.floor(Math.random() * totalCells);
const randomFood = Math.floor(Math.random() * totalCells); 

//Find the cell at position randomsnake/food inside the grid and add the class snake / food to it so we can visualise
cells[randomSnake].classList.add('snake');
cells[randomFood].classList.add('food');

//Storing index of the snake head and food
//Snake has multiple segments, it grows as we eat so we need to keep track of all its parts and list positions
let snake = [randomSnake];
let foodIndex = randomFood;
let emptyCells = [];

const youWin = () => {
    timerMessage.classList.remove("hidden");
    console.log('you win');
    //alert('you win');
}



//keydown on the randomSnake event so that we can move it once initialised

document.addEventListener('keydown', (event) => {

    if(!timerStarted) {
        timerStarted = true;
        winTimer = setTimeout(youWin, 30000);
    }

    if (gameOver) return; // don't move if game is over

    let newHead = snake[0]; //current head position is index 0

    switch (event.key) {
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


    if (checkGameOver(newHead)) {
        gameOver = true;
        gameMessage.classList.remove("hidden");
        return
    }
    
        //We always move the head forward in the game onto the next square, only if we don't eat we remove the tail. 
        //we are always adding the new head at the start of the array regardless of the food was eaten, because the snake moves
        //forward by one cell.
    snake.forEach(index => cells[index].classList.remove('snake'));
    snake.unshift(newHead);

    if (newHead === foodIndex) {
    cells[foodIndex].classList.remove('food');
    foodIndex = Math.floor(Math.random() * totalCells);
    cells[foodIndex].classList.add('food');
    snake.forEach(index => cells[index].classList.add('snake'));
    score += 10;
    scoreCount.textContent = `Score: ${score}`;
    
    } else {

    snake.pop();
    snake.forEach(index => cells[index].classList.add('snake'));
    

    }

});

const render = () => {
    if (gameOver) {
        clearInterval
    }
}


const resetGame = () => 
{
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
    timerStarted = false;
    clearTimeout(winTimer);
    gameMessage.classList.add("hidden");
    timerMessage.classList.add("hidden");

};


//state of the game 

const checkGameOver = (newHead) => {
    // If the head moves off the top or bottom
    if (newHead < 0 || newHead >= totalCells) {
        return true; // game over
    }

    // Optional: self-collision
    if (snake.includes(newHead)) {
       gameMessage.classList.remove("hidden");
    }

    return false; // no collision
};

// const init = () => {
//     gameMessage.classList.add("hidden");
//     timerMessage.classList.add("hidden");

//     score = 0;
//     gameOver = false;

// };



//Game over function 
//If snake = snake - game over
// if timer runs out - game over
// if snake hits border - game over




reset.addEventListener('click', resetGame);
//pause.addEventListener('click', pauseGame);

// init();





















// //Event listeners
// reset.addEventListener("click");
// pause.addEventListener("click", pauseGame);