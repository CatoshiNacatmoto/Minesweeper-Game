"use strict";

// Selecting necessary DOM elements
const grille = document.querySelector(".grille");
const minesColumnsOptions = document.querySelector("#mines_columns_options");
const minesRowsOptions = document.querySelector("#mines_rows_options");
const resetBtn = document.getElementById("reset-btn");
const mineCounter = document.getElementById("mine-counter");

let grid = [];
let totalMines = 0;
let minesLeft = 0;
let gameOver = false;

// Initialize the game grid based on user input
function updateGrid() {
  grille.innerHTML = "";
  grid = [];
  gameOver = false;

  // Create rows and columns for the grid
  for (let i = 0; i < +minesRowsOptions.value; i++) {
    let row = document.createElement("tr");
    grid.push([]);

    for (let j = 0; j < +minesColumnsOptions.value; j++) {
      let cell = document.createElement("td");
      cell.classList.add("mines");
      cell.id = `cell-${i}-${j}`;

      cell.addEventListener("click", () => handleCellClick(i, j));

      row.appendChild(cell);
      grid[i].push({ mine: false, revealed: false });
    }

    grille.appendChild(row);
  }

  placeMines();
  updateMineCounter();
}

// Place mines randomly in the grid
function placeMines() {
  const totalCells = +minesRowsOptions.value * +minesColumnsOptions.value;
  totalMines = Math.floor(totalCells * 0.1);
  minesLeft = totalMines;
  let placedMines = 0;

  while (placedMines < totalMines) {
    const randomRow = Math.floor(Math.random() * minesRowsOptions.value);
    const randomCol = Math.floor(Math.random() * minesColumnsOptions.value);

    if (!grid[randomRow][randomCol].mine) {
      grid[randomRow][randomCol].mine = true;
      placedMines++;
    }
  }
}

// Update the counter for remaining mines
function updateMineCounter() {
  mineCounter.textContent = `Mines restante: ${minesLeft}`;
}

// Handle clicks on cells
function handleCellClick(row, col) {
  if (gameOver) return;

  const cell = grid[row][col];

  if (cell.revealed) return;

  cell.revealed = true;
  const cellElement = document.getElementById(`cell-${row}-${col}`);

  if (cell.mine) {
    cellElement.classList.add("mine");
    revealAllMines();
  } else {
    cellElement.classList.add("safe");
    const minesAround = countMinesAround(row, col);
    if (minesAround > 0) {
      cellElement.textContent = minesAround;
    } else {
      revealAdjacentCells(row, col);
    }
    checkWinCondition();
  }
}

// Reveal all mines after clicking on a mine
function revealAllMines() {
  alert("Boom! You clicked on a mine.");
  gameOver = true;

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j].mine) {
        const cellElement = document.getElementById(`cell-${i}-${j}`);
        cellElement.classList.add("mine");
        cellElement.innerHTML = '<img src="./image/bombe.png" alt="mine">';
      }
    }
  }
}

// Count the mines around a cell
function countMinesAround(row, col) {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const newRow = row + i;
      const newCol = col + j;
      if (
        newRow >= 0 &&
        newRow < grid.length &&
        newCol >= 0 &&
        newCol < grid[0].length
      ) {
        if (grid[newRow][newCol].mine) {
          count++;
        }
      }
    }
  }
  return count;
}

// Reveal adjacent cells if no mines are around
function revealAdjacentCells(row, col) {
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const newRow = row + i;
      const newCol = col + j;
      if (
        newRow >= 0 &&
        newRow < grid.length &&
        newCol >= 0 &&
        newCol < grid[0].length
      ) {
        if (!grid[newRow][newCol].revealed) {
          handleCellClick(newRow, newCol);
        }
      }
    }
  }
}

// Check if all safe cells are revealed
function checkWinCondition() {
  let allSafeCellsRevealed = true;

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (!grid[i][j].mine && !grid[i][j].revealed) {
        allSafeCellsRevealed = false;
      }
    }
  }

  if (allSafeCellsRevealed) {
    alert("Congratulations! You have won the game.");
    resetGame();
  }
}

// Reset the game
function resetGame() {
  updateGrid();
}

// Event listeners for input changes
minesColumnsOptions.addEventListener("change", updateGrid);
minesRowsOptions.addEventListener("change", updateGrid);
resetBtn.addEventListener("click", resetGame);

// Initial grid creation
updateGrid();
