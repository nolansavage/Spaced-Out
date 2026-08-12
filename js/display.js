export const INTERNAL_WIDTH = 320;
export const INTERNAL_HEIGHT = 180;
const MAX_PIXEL_SCALE = 3;

export function getPixelScale(viewportWidth, viewportHeight) {
  return Math.max(1, Math.min(MAX_PIXEL_SCALE, Math.floor(Math.min(
    viewportWidth / INTERNAL_WIDTH,
    viewportHeight / INTERNAL_HEIGHT
  ))));
}

export function applyPixelScale(shell, canvas) {
  const scale = getPixelScale(window.innerWidth, window.innerHeight);
  shell.style.width = `${INTERNAL_WIDTH * scale}px`;
  shell.style.height = `${INTERNAL_HEIGHT * scale}px`;
  canvas.style.width = `${INTERNAL_WIDTH * scale}px`;
  canvas.style.height = `${INTERNAL_HEIGHT * scale}px`;
}