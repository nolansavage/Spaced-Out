const SPEED = 76;

export class Player {
  constructor(profile, spawn) {
    this.profile = profile;
    this.x = spawn.x;
    this.y = spawn.y;
    this.width = 10;
    this.height = 12;
  }

  update(input, world, deltaTime) {
    let horizontal = 0;
    let vertical = 0;
    if (input.KeyA) horizontal = -1;
    if (input.KeyD) horizontal = 1;
    if (input.KeyW) vertical = -1;
    if (input.KeyS) vertical = 1;

    const distance = SPEED * deltaTime;
    if (horizontal && world.canOccupy(this.x + horizontal * distance, this.y, this.width, this.height)) {
      this.x += horizontal * distance;
    }
    if (vertical && world.canOccupy(this.x, this.y + vertical * distance, this.width, this.height)) {
      this.y += vertical * distance;
    }
  }

  draw(context, camera) {
    const x = Math.round(this.x - camera.x);
    const y = Math.round(this.y - camera.y);
    context.fillStyle = "#1d2938";
    context.fillRect(x + 2, y, 6, 3);
    context.fillStyle = this.profile.suitColor;
    context.fillRect(x + 1, y + 3, 8, 7);
    context.fillStyle = this.profile.appearance === "Visor" ? "#69d9ff" : "#f1c8a6";
    context.fillRect(x + 3, y + 1, 4, 3);
    context.fillStyle = "#dce8e5";
    context.fillRect(x + 1, y + 10, 3, 2);
    context.fillRect(x + 6, y + 10, 3, 2);
  }
}