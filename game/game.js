"use strict";

const boardElement = document.querySelector("#board");
const sizeSelect = document.querySelector("#size-select");
const newGameButton = document.querySelector("#new-game");
const movesElement = document.querySelector("#moves");
const timeElement = document.querySelector("#time");
const bestElement = document.querySelector("#best");
const statusElement = document.querySelector("#status");

let size = Number(sizeSelect.value);
let tiles = [];
let emptyIndex = 0;
let moves = 0;
let startedAt = null;
let timerId = null;
let finished = false;

function isSolved() {
  return tiles.every((tile, index) => tile === (index + 1) % tiles.length);
}

function getNeighbors(index) {
  const row = Math.floor(index / size);
  const column = index % size;
  const neighbors = [];

  if (row > 0) neighbors.push(index - size);
  if (row < size - 1) neighbors.push(index + size);
  if (column > 0) neighbors.push(index - 1);
  if (column < size - 1) neighbors.push(index + 1);

  return neighbors;
}

function shuffle() {
  tiles = Array.from({ length: size * size }, (_, index) => (index + 1) % (size * size));
  emptyIndex = tiles.length - 1;

  let previousEmptyIndex = -1;
  for (let step = 0; step < 600; step += 1) {
    const options = getNeighbors(emptyIndex).filter((index) => index !== previousEmptyIndex);
    const nextIndex = options[Math.floor(Math.random() * options.length)];
    [tiles[emptyIndex], tiles[nextIndex]] = [tiles[nextIndex], tiles[emptyIndex]];
    previousEmptyIndex = emptyIndex;
    emptyIndex = nextIndex;
  }

  if (isSolved()) {
    const nextIndex = getNeighbors(emptyIndex)[0];
    [tiles[emptyIndex], tiles[nextIndex]] = [tiles[nextIndex], tiles[emptyIndex]];
    emptyIndex = nextIndex;
  }

  moves = 0;
  startedAt = null;
  finished = false;
  window.clearInterval(timerId);
  timerId = null;
  movesElement.textContent = "0";
  timeElement.textContent = "00:00";
  statusElement.textContent = "Tap a tile beside the empty space to move it.";
  statusElement.classList.remove("is-win");
  updateBest();
  render();
}

function render(focusTile = null) {
  boardElement.replaceChildren();
  boardElement.style.gridTemplateColumns = `repeat(${size}, minmax(0, 1fr))`;

  tiles.forEach((value, index) => {
    if (value === 0) {
      const empty = document.createElement("div");
      empty.className = "empty-tile";
      empty.setAttribute("aria-hidden", "true");
      boardElement.append(empty);
      return;
    }

    const tile = document.createElement("button");
    tile.className = "tile";
    tile.type = "button";
    tile.textContent = String(value);
    tile.dataset.index = String(index);
    tile.dataset.value = String(value);
    tile.setAttribute("aria-label", `Tile ${value}, row ${Math.floor(index / size) + 1}, column ${(index % size) + 1}`);
    if (getNeighbors(emptyIndex).includes(index)) {
      tile.classList.add("movable");
    }
    boardElement.append(tile);
  });

  if (focusTile !== null) {
    boardElement.querySelector(`[data-value="${focusTile}"]`)?.focus();
  }
}

function moveTile(index) {
  if (finished || !getNeighbors(emptyIndex).includes(index)) return;

  const movedTile = tiles[index];
  [tiles[emptyIndex], tiles[index]] = [tiles[index], tiles[emptyIndex]];
  emptyIndex = index;
  moves += 1;
  movesElement.textContent = String(moves);

  if (startedAt === null) {
    startedAt = Date.now();
    timerId = window.setInterval(updateTime, 250);
  }

  render(movedTile);

  if (isSolved()) {
    finished = true;
    window.clearInterval(timerId);
    timerId = null;
    updateTime();
    statusElement.textContent = `Puzzle solved in ${moves} moves. Nice work!`;
    statusElement.classList.add("is-win");
    saveBest();
  }
}

function updateTime() {
  const elapsedSeconds = startedAt === null ? 0 : Math.floor((Date.now() - startedAt) / 1000);
  timeElement.textContent = formatTime(elapsedSeconds);
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function getElapsedSeconds() {
  return startedAt === null ? 0 : Math.floor((Date.now() - startedAt) / 1000);
}

function readBest() {
  try {
    const value = localStorage.getItem(`number-slide-best-${size}`);
    if (!value) return null;

    const [bestMoves, bestSeconds] = value.split(":").map(Number);
    if (Number.isInteger(bestMoves) && Number.isInteger(bestSeconds)) {
      return { moves: bestMoves, seconds: bestSeconds };
    }
  } catch {
    return null;
  }

  return null;
}

function updateBest() {
  const best = readBest();
  bestElement.textContent = best ? `${best.moves} · ${formatTime(best.seconds)}` : "—";
  bestElement.setAttribute("aria-label", best ? `Best: ${best.moves} moves in ${formatTime(best.seconds)}` : "No best score yet");
}

function saveBest() {
  const score = { moves, seconds: getElapsedSeconds() };
  const best = readBest();

  if (!best || score.moves < best.moves || (score.moves === best.moves && score.seconds < best.seconds)) {
    try {
      localStorage.setItem(`number-slide-best-${size}`, `${score.moves}:${score.seconds}`);
      updateBest();
    } catch {
      bestElement.textContent = "Unavailable";
      bestElement.setAttribute("aria-label", "Best score storage is unavailable");
      statusElement.textContent += " This device could not save your best score.";
    }
  }
}

boardElement.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-index]");
  if (button) moveTile(Number(button.dataset.index));
});

boardElement.addEventListener("keydown", (event) => {
  const offsets = { ArrowUp: size, ArrowDown: -size, ArrowLeft: 1, ArrowRight: -1 };
  const offset = offsets[event.key];
  if (offset === undefined) return;

  const activeIndex = Number(document.activeElement.dataset.index);
  if (!Number.isInteger(activeIndex)) return;

  const targetIndex = emptyIndex + offset;
  if (getNeighbors(emptyIndex).includes(targetIndex) && targetIndex === activeIndex) {
    event.preventDefault();
    moveTile(activeIndex);
  }
});

sizeSelect.addEventListener("change", () => {
  size = Number(sizeSelect.value);
  shuffle();
});

newGameButton.addEventListener("click", shuffle);

shuffle();
