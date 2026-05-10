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
  outer: for (let y = arena.length - 1; y > 0; --y) {
    for (let x = 0; x < arena[y].length; ++x) {
      if (arena[y][x] === 0) continue outer;
    }
    const row = arena.splice(y, 1)[0].fill(0);
    arena.unshift(row);
    ++y;
    player.score += rowCount * 10;
    rowCount *= 2;
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
