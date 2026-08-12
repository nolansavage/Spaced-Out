export const REPAIR_DEFINITIONS = {
  "emergency-power": { id: "emergency-power", name: "Emergency Power", requirements: { scrap: 3, "ship-components": 1 }, power: 40, aiMemory: 5, unlocks: ["reactor-core"] },
  "hydroponics-system": { id: "hydroponics-system", name: "Hydroponics System", requirements: { scrap: 2, "ship-components": 1 }, power: 20, aiMemory: 5, unlocks: ["advanced-hydroponics"] },
  "life-support": { id: "life-support", name: "Life Support", requirements: { scrap: 4, "ship-components": 1 }, power: 15, aiMemory: 5, unlocks: [] },
  "navigation-core": { id: "navigation-core", name: "Navigation Core", requirements: { "advanced-components": 1, "rare-metals": 1 }, power: 5, aiMemory: 15, unlocks: [] },
  "research-laboratory": { id: "research-laboratory", name: "Research Laboratory", requirements: { "processed-metal": 2, "organic-samples": 1 }, power: 5, aiMemory: 10, unlocks: [] },
  "communication-array": { id: "communication-array", name: "Communication Array", requirements: { "advanced-components": 1, "rare-minerals": 1 }, power: 5, aiMemory: 15, unlocks: [] },
  "ai-core": { id: "ai-core", name: "AI Core", requirements: { "unknown-technology": 1, "ship-components": 2 }, power: 5, aiMemory: 20, unlocks: [] }
};

export const AREA_DEFINITIONS = {
  "research-wing": { name: "Research Wing", requirement: "AI memory 20%" },
  "reactor-core": { name: "Reactor Core", requirement: "Emergency Power" },
  "crew-quarters": { name: "Crew Quarters", requirement: "Security access" }
};

export class Ship {
  constructor(savedState = {}) {
    this.state = {
      repairs: { "emergency-power": false, "hydroponics-system": false, "life-support": false, "navigation-core": false, "research-laboratory": false, "communication-array": false, "ai-core": false, ...savedState.repairs },
      unlockedAreas: Array.isArray(savedState.unlockedAreas) ? savedState.unlockedAreas : [],
      power: Number.isInteger(savedState.power) ? savedState.power : 0,
      roomUpgrades: { hydroponics: 1, engineering: 1, ...savedState.roomUpgrades }
    };
  }

  repair(systemId, inventory, ai) {
    const definition = REPAIR_DEFINITIONS[systemId];
    if (!definition) return { changed: false, message: "Unknown ship system." };
    if (this.state.repairs[systemId]) return { changed: false, message: `${definition.name} is already restored.` };
    if (!Object.entries(definition.requirements).every(([itemId, quantity]) => inventory.has(itemId, quantity))) return { changed: false, message: "Repair materials required." };
    for (const [itemId, quantity] of Object.entries(definition.requirements)) inventory.remove(itemId, quantity);
    this.state.repairs[systemId] = true;
    this.state.power = Math.min(100, this.state.power + definition.power);
    definition.unlocks.forEach((areaId) => this.unlock(areaId));
    ai.addMemory(definition.aiMemory);
    return { changed: true, message: `${definition.name} restored.` };
  }

  unlock(areaId) {
    if (!this.state.unlockedAreas.includes(areaId)) this.state.unlockedAreas.push(areaId);
  }

  isUnlocked(areaId, aiMemory) {
    if (areaId === "research-wing") return aiMemory >= 20;
    return this.state.unlockedAreas.includes(areaId);
  }

  getStatus(aiMemory) {
    return [
      { name: "Power", value: this.state.power },
      { name: "Life Support", value: this.state.repairs["life-support"] ? 100 : 20 },
      { name: "Hydroponics", value: this.state.roomUpgrades.hydroponics * 33 },
      { name: "AI Memory", value: aiMemory },
      { name: "Navigation", value: this.isUnlocked("reactor-core", aiMemory) ? 10 : null }
    ];
  }

  upgradeRoom(roomId, inventory, stats) {
    if (!this.state.roomUpgrades[roomId] || this.state.roomUpgrades[roomId] >= 3) return { changed: false, message: "No room upgrade available." };
    if (!inventory.has("scrap", 5) || stats.credits < 25) return { changed: false, message: "Upgrade requires 5 Scrap and 25 credits." };
    inventory.remove("scrap", 5); stats.credits -= 25; this.state.roomUpgrades[roomId] += 1;
    return { changed: true, message: `${roomId} upgraded.` };
  }

  toJSON() { return { repairs: { ...this.state.repairs }, unlockedAreas: [...this.state.unlockedAreas], power: this.state.power, roomUpgrades: { ...this.state.roomUpgrades } }; }
}