export class Camera {
  constructor(viewportWidth, viewportHeight) {
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
    this.x = 0;
    this.y = 0;
  }

  follow(target, world, deltaTime) {
    const targetX = target.x + target.width / 2 - this.viewportWidth / 2;
    const targetY = target.y + target.height / 2 - this.viewportHeight / 2;
    const smoothing = Math.min(1, deltaTime * 7);
    this.x += (targetX - this.x) * smoothing;
    this.y += (targetY - this.y) * smoothing;
    this.x = Math.max(0, Math.min(this.x, world.width - this.viewportWidth));
    this.y = Math.max(0, Math.min(this.y, world.height - this.viewportHeight));
  }
}