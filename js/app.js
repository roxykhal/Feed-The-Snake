/*---------------------------- Variables (state) ----------------------------*/

let gameOver = false;
let gameStarted = false;
let score = 0;
let paused = false;


/*------------------------ Cached Element References ------------------------*/
const reset = document.querySelector("#resetButton");
const pause = document.querySelector("#pauseButton");
const scoreCount = document.querySelector("#score");
const gameMessage = document.querySelector('#message');
const restart = document.querySelector('#restartGame');

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



//keydown on the randomSnake event so that we can move it once initialised

document.addEventListener('keydown', (event) => {


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


    if (checkGameOver(newHead, event.key)) {
        gameOver = true;
        gameMessage.classList.remove("hidden");
        return;
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

    currentScore = score += 10;
    scoreCount.textContent = `Score: ${score}`;
    
    } else {

    snake.pop();
    snake.forEach(index => cells[index].classList.add('snake'));
    

    }

});


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
   
};


//state of the game 

const checkGameOver = (newHead, key) => {
  // If the head moves off the top or bottom
  if (
    newHead < 0 || newHead >= totalCells ||
    (newHead % 20 === 0 && key === "ArrowRight") ||
    (newHead % 20 === 19 && key === "ArrowLeft") // changed this one
  )
    return true; // game over
  };

//restart game function
  const restartGame = () => {
    resetGame();
    gameMessage.classList.add("hidden");

    };

reset.addEventListener('click', resetGame);
pause.addEventListener('click', pauseGame);





















// //Event listeners
// reset.addEventListener("click");
// pause.addEventListener("click", pauseGame);