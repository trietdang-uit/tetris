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
