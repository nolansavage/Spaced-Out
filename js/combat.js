import { getEquipment } from "./equipment.js";

function intersects(first, second) { return first.x < second.x + second.width && first.x + first.width > second.x && first.y < second.y + second.height && first.y + first.height > second.y; }

export class Combat {
  constructor(savedState = {}) { this.projectiles = []; this.lastShotAt = savedState.lastShotAt ?? -Infinity; }

  fire(itemId, player, targetX, targetY, inventory, now) {
    const weapon = getEquipment(itemId);
    if (!weapon) return { changed: false, message: "No weapon selected." };
    if (now - this.lastShotAt < weapon.cooldown) return { changed: false, message: "Weapon cooling." };
    if (!inventory.remove(weapon.ammoItemId)) return { changed: false, message: "No Energy Cells." };
    const originX = player.x + player.width / 2;
    const originY = player.y + player.height / 2;
    const distance = Math.hypot(targetX - originX, targetY - originY) || 1;
    this.projectiles.push({ x: originX, y: originY, width: 3, height: 3, velocityX: (targetX - originX) / distance * weapon.projectileSpeed, velocityY: (targetY - originY) / distance * weapon.projectileSpeed, remainingRange: weapon.range, damage: weapon.damage });
    this.lastShotAt = now;
    return { changed: true, message: "Pistol fired." };
  }

  update(deltaTime, enemies) {
    const defeated = [];
    this.projectiles = this.projectiles.filter((projectile) => {
      const totalX = projectile.velocityX * deltaTime;
      const totalY = projectile.velocityY * deltaTime;
      const steps = Math.max(1, Math.ceil(Math.hypot(totalX, totalY) / 3));
      for (let step = 0; step < steps; step += 1) {
        projectile.x += totalX / steps;
        projectile.y += totalY / steps;
        projectile.remainingRange -= Math.hypot(totalX / steps, totalY / steps);
        const enemy = enemies.find((entry) => entry.active && intersects(projectile, entry));
        if (enemy) { enemy.health -= projectile.damage; if (enemy.health <= 0) defeated.push(enemy); return false; }
      }
      return projectile.remainingRange > 0;
    });
    return defeated;
  }

  draw(context, camera) { context.fillStyle = "#e3ff8e"; for (const projectile of this.projectiles) context.fillRect(Math.round(projectile.x - camera.x), Math.round(projectile.y - camera.y), projectile.width, projectile.height); }
  toJSON() { return {}; }
}