const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const playPanel = document.querySelector(".play-panel");

const ARENA_WIDTH = 12;
const ARENA_HEIGHT = 20;

let CELL_SIZE = 28;

const COLORS = {
  1: "#c084fc",
  2: "#fcd34d",
  3: "#fb923c",
  4: "#60a5fa",
  5: "#22d3ee",
  6: "#4ade80",
  7: "#f87171",
};

let pieceBag = [];

function getDpr() {
  return Math.min(window.devicePixelRatio || 1, 2);
}

function syncCanvasPixels() {
  const logicalW = ARENA_WIDTH * CELL_SIZE;
  const logicalH = ARENA_HEIGHT * CELL_SIZE;
  const dpr = getDpr();

  canvas.style.width = `${logicalW}px`;
  canvas.style.height = `${logicalH}px`;
  canvas.width = Math.round(logicalW * dpr);
  canvas.height = Math.round(logicalH * dpr);

  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.imageSmoothingEnabled = false;
}

function fitCellSize() {
  if (!playPanel) return;

  const hud = document.querySelector(".hud");
  const shell = document.querySelector(".canvas-shell");
  const rect = playPanel.getBoundingClientRect();

  const hudH = hud ? hud.offsetHeight + 20 : 72;
  const shellPad = shell ? 12 : 0;
  const availW = Math.max(1, rect.width - shellPad);
  const availH = Math.max(1, rect.height - hudH - shellPad);

  const byW = Math.floor(availW / ARENA_WIDTH);
  const byH = Math.floor(availH / ARENA_HEIGHT);

  CELL_SIZE = Math.max(14, Math.min(byW, byH, 40));
  syncCanvasPixels();
}

function arenaSweep() {
  let rowCount = 1;

  for (let y = arena.length - 1; y >= 0; --y) {
    let full = true;

    for (let x = 0; x < arena[y].length; ++x) {
      if (arena[y][x] === 0) {
        full = false;
        break;
      }
    }

    if (!full) continue;

    arena.splice(y, 1);
    arena.unshift(new Array(ARENA_WIDTH).fill(0));

    player.score += rowCount * 10;
    rowCount *= 2;

    y++;
  }
}

function collide(arena, player) {
  const [m, o] = [player.matrix, player.pos];

  for (let y = 0; y < m.length; ++y) {
    for (let x = 0; x < m[y].length; ++x) {
      if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
        return true;
      }
    }
  }

  return false;
}

function createMatrix(w, h) {
  const matrix = [];
  while (h--) matrix.push(new Array(w).fill(0));
  return matrix;
}

function createPiece(type) {
  if (type === "T")
    return [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ];

  if (type === "O")
    return [
      [2, 2],
      [2, 2],
    ];

  if (type === "L")
    return [
      [0, 3, 0],
      [0, 3, 0],
      [0, 3, 3],
    ];

  if (type === "J")
    return [
      [0, 4, 0],
      [0, 4, 0],
      [4, 4, 0],
    ];

  if (type === "I")
    return [
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0],
    ];

  if (type === "S")
    return [
      [0, 6, 6],
      [6, 6, 0],
      [0, 0, 0],
    ];

  if (type === "Z")
    return [
      [7, 7, 0],
      [0, 7, 7],
      [0, 0, 0],
    ];

  return [[0]];
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; --i) {
    const j = (Math.random() * (i + 1)) | 0;
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

function getNextPieceType() {
  if (pieceBag.length === 0) {
    pieceBag = shuffle(["I", "L", "J", "O", "T", "S", "Z"]);
  }

  return pieceBag.pop();
}

function drawGrid() {
  const W = ARENA_WIDTH * CELL_SIZE;
  const H = ARENA_HEIGHT * CELL_SIZE;

  context.strokeStyle = "rgba(255,255,255,0.05)";
  context.lineWidth = 1;

  for (let x = 0; x <= ARENA_WIDTH; x++) {
    const px = x * CELL_SIZE;
    context.beginPath();
    context.moveTo(px + 0.5, 0);
    context.lineTo(px + 0.5, H);
    context.stroke();
  }

  for (let y = 0; y <= ARENA_HEIGHT; y++) {
    const py = y * CELL_SIZE;
    context.beginPath();
    context.moveTo(0, py + 0.5);
    context.lineTo(W, py + 0.5);
    context.stroke();
  }
}

function drawBlock(gx, gy, fill) {
  const x0 = gx * CELL_SIZE;
  const y0 = gy * CELL_SIZE;

  context.fillStyle = fill;
  context.fillRect(x0, y0, CELL_SIZE, CELL_SIZE);

  context.fillStyle = "rgba(255,255,255,0.14)";
  context.fillRect(x0, y0, CELL_SIZE, 1);
  context.fillRect(x0, y0, 1, CELL_SIZE);

  context.fillStyle = "rgba(0,0,0,0.22)";
  context.fillRect(x0, y0 + CELL_SIZE - 1, CELL_SIZE, 1);
  context.fillRect(x0 + CELL_SIZE - 1, y0, 1, CELL_SIZE);
}

function draw() {
  const W = ARENA_WIDTH * CELL_SIZE;
  const H = ARENA_HEIGHT * CELL_SIZE;
  const dpr = getDpr();

  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.imageSmoothingEnabled = false;

  context.fillStyle = "#050608";
  context.fillRect(0, 0, W, H);

  drawGrid();
  drawMatrix(arena, { x: 0, y: 0 });
  drawMatrix(player.matrix, player.pos);
}

function drawGameOver() {
  const W = ARENA_WIDTH * CELL_SIZE;
  const H = ARENA_HEIGHT * CELL_SIZE;

  context.fillStyle = "rgba(0, 0, 0, 0.68)";
  context.fillRect(0, 0, W, H);

  context.fillStyle = "#ffffff";
  context.font = "700 28px Outfit, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("GAME OVER", W / 2, H / 2 - 18);

  context.font = "500 14px Outfit, sans-serif";
  context.fillText("Nhấn Enter để chơi lại", W / 2, H / 2 + 22);
}

function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        const gx = x + offset.x;
        const gy = y + offset.y;

        if (
          gx >= -1 &&
          gx < ARENA_WIDTH + 1 &&
          gy >= -1 &&
          gy < ARENA_HEIGHT + 1
        ) {
          drawBlock(gx, gy, COLORS[value] || "#fff");
        }
      }
    });
  });
}

function merge(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
}

function rotate(matrix, dir) {
  for (let y = 0; y < matrix.length; ++y) {
    for (let x = 0; x < y; ++x) {
      [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
    }
  }

  if (dir > 0) matrix.forEach((row) => row.reverse());
  else matrix.reverse();
}

function playerDrop() {
  if (isGameOver) return;

  player.pos.y++;

  if (collide(arena, player)) {
    player.pos.y--;
    merge(arena, player);

    arenaSweep();
    playerReset();

    updateScore();
  }

  dropCounter = 0;
}

function playerMove(dir) {
  if (isGameOver) return;

  player.pos.x += dir;

  if (collide(arena, player)) {
    player.pos.x -= dir;
  }
}

function playerReset() {
  player.matrix = createPiece(getNextPieceType());

  player.pos.y = 0;
  player.pos.x =
    ((arena[0].length / 2) | 0) - ((player.matrix[0].length / 2) | 0);

  if (collide(arena, player)) {
    isGameOver = true;
  }
}

function playerRotate(dir) {
  if (isGameOver) return;

  const pos = player.pos.x;
  let offset = 1;

  rotate(player.matrix, dir);

  while (collide(arena, player)) {
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));

    if (offset > player.matrix[0].length) {
      rotate(player.matrix, -dir);
      player.pos.x = pos;
      return;
    }
  }
}

function restartGame() {
  arena.forEach((row) => row.fill(0));

  pieceBag = [];
  player.score = 0;
  updateScore();

  isGameOver = false;
  dropCounter = 0;
  lastTime = 0;

  playerReset();
  requestAnimationFrame(update);
}

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;
let isGameOver = false;

function update(time = 0) {
  if (isGameOver) {
    draw();
    drawGameOver();
    return;
  }

  const deltaTime = Math.min(time - lastTime, 100);
  lastTime = time;

  dropCounter += deltaTime;

  if (dropCounter > dropInterval) {
    playerDrop();
  }

  draw();
  requestAnimationFrame(update);
}

function updateScore() {
  scoreElement.innerText = player.score;
}

const arena = createMatrix(ARENA_WIDTH, ARENA_HEIGHT);
const player = { pos: { x: 0, y: 0 }, matrix: null, score: 0 };

canvas.addEventListener("click", () => canvas.focus());

function onLayoutResize() {
  fitCellSize();

  if (isGameOver) {
    draw();
    drawGameOver();
  }
}

if (typeof ResizeObserver !== "undefined" && playPanel) {
  const ro = new ResizeObserver(() => onLayoutResize());
  ro.observe(playPanel);
}

window.addEventListener("resize", onLayoutResize);

document.addEventListener("keydown", (event) => {
  if (isGameOver && event.key === "Enter") {
    event.preventDefault();
    restartGame();
    return;
  }

  const k = event.keyCode;

  if (k === 37 || k === 38 || k === 39 || k === 40 || k === 81 || k === 87) {
    event.preventDefault();

    if (k === 37) playerMove(-1);
    else if (k === 39) playerMove(1);
    else if (k === 40) playerDrop();
    else if (k === 38) playerRotate(1);
    else if (k === 81) playerRotate(-1);
    else if (k === 87) playerRotate(1);
  }
});

onLayoutResize();
playerReset();
updateScore();

requestAnimationFrame(update);

requestAnimationFrame(() => {
  onLayoutResize();
});
