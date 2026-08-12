export const ENEMY_DEFINITIONS = {
  "small-space-roach": { id: "small-space-roach", name: "Small Space Roach", width: 12, height: 8, health: 20, damage: 8, speed: 20, attackCooldown: 900, drops: { scrap: 1, "organic-material": 1, "energy-cells": 1 } }
};

export const SPAWN_POINTS = [
  { id: "roach-engineering-a", enemyId: "small-space-roach", x: 840, y: 210 },
  { id: "roach-corridor-a", enemyId: "small-space-roach", x: 600, y: 320 }
];

export class Enemies {
  constructor(savedState = {}) {
    const defeated = new Set(savedState.defeated ?? []);
    this.enemies = SPAWN_POINTS.map((spawn) => ({ ...ENEMY_DEFINITIONS[spawn.enemyId], spawnId: spawn.id, x: spawn.x, y: spawn.y, active: !defeated.has(spawn.id), lastAttackAt: -Infinity }));
    this.discoveredAreas = Array.isArray(savedState.discoveredAreas) ? savedState.discoveredAreas : [];
  }

  update(deltaTime, player, now, onDamage) {
    for (const enemy of this.enemies) {
      if (!enemy.active) continue;
      const deltaX = player.x - enemy.x; const deltaY = player.y - enemy.y; const distance = Math.hypot(deltaX, deltaY) || 1;
      if (distance < 100 && distance > 14) { enemy.x += deltaX / distance * enemy.speed * deltaTime; enemy.y += deltaY / distance * enemy.speed * deltaTime; }
      if (distance <= 14 && now - enemy.lastAttackAt >= enemy.attackCooldown) { enemy.lastAttackAt = now; onDamage(enemy.damage); }
    }
  }

  defeat(enemy, inventory) { if (!enemy.active) return; enemy.active = false; Object.entries(enemy.drops).forEach(([itemId, quantity]) => inventory.add(itemId, quantity)); }
  draw(context, camera) { for (const enemy of this.enemies) { if (!enemy.active) continue; context.fillStyle = "#9a4e3f"; context.fillRect(Math.round(enemy.x - camera.x), Math.round(enemy.y - camera.y), enemy.width, enemy.height); context.fillStyle = "#291d24"; context.fillRect(Math.round(enemy.x + 3 - camera.x), Math.round(enemy.y + 2 - camera.y), 2, 2); } }
  toJSON() { return { defeated: this.enemies.filter((enemy) => !enemy.active).map((enemy) => enemy.spawnId), discoveredAreas: [...this.discoveredAreas] }; }
}