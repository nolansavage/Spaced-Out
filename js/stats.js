export const DEFAULT_MAX_ENERGY = 100;
export const DEFAULT_CREDITS = 100;
export const DEFAULT_MAX_HEALTH = 100;

export function createPlayerStats(savedStats = {}) {
  const maxEnergy = Number.isFinite(savedStats.maxEnergy) && savedStats.maxEnergy > 0
    ? Math.floor(savedStats.maxEnergy)
    : DEFAULT_MAX_ENERGY;
  const maxHealth = Number.isFinite(savedStats.maxHealth) && savedStats.maxHealth > 0
    ? Math.floor(savedStats.maxHealth)
    : DEFAULT_MAX_HEALTH;
  return {
    maxHealth,
    health: Math.max(0, Math.min(maxHealth, Number.isFinite(savedStats.health) ? Math.floor(savedStats.health) : maxHealth)),
    maxEnergy,
    energy: Math.max(0, Math.min(maxEnergy, Number.isFinite(savedStats.energy) ? Math.floor(savedStats.energy) : maxEnergy)),
    credits: Math.max(0, Number.isFinite(savedStats.credits) ? Math.floor(savedStats.credits) : DEFAULT_CREDITS)
  };
}

export function normalizeHealth(stats) { stats.health = Math.max(0, Math.min(stats.maxHealth, Number.isFinite(stats.health) ? Math.floor(stats.health) : stats.maxHealth)); return stats; }

export function spendEnergy(stats, amount) {
  if (!Number.isFinite(amount) || amount < 0 || stats.energy < amount) return false;
  stats.energy = Math.max(0, stats.energy - amount);
  return true;
}

export function restoreEnergy(stats) {
  stats.energy = stats.maxEnergy;
}

export function takeDamage(stats, amount) { stats.health = Math.max(0, stats.health - Math.max(0, Math.floor(amount))); return stats.health === 0; }
export function restoreHealth(stats, amount = stats.maxHealth) { stats.health = Math.min(stats.maxHealth, Math.max(0, Math.floor(amount))); }