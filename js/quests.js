export const QUESTS = {
  "aria-diagnostic": { id: "aria-diagnostic", npcId: "aria", title: "Broken Diagnostic", description: "Bring Aria 2 Scrap.", requirements: { scrap: 2 }, rewards: { friendship: 10 } },
  "milo-sample": { id: "milo-sample", npcId: "milo", title: "Living Sample", description: "Bring Milo 1 Organic Sample.", requirements: { "organic-samples": 1 }, rewards: { friendship: 10 } },
  "nova-chart": { id: "nova-chart", npcId: "nova", title: "Signal Chart", description: "Return from any expedition.", requirements: {}, rewards: { friendship: 10 } }
};

export class Quests {
  constructor(savedState = {}) { this.completed = Array.isArray(savedState.completed) ? savedState.completed : []; }
  complete(questId, inventory) { const quest = QUESTS[questId]; if (!quest || this.completed.includes(questId) || !Object.entries(quest.requirements).every(([id, amount]) => inventory.has(id, amount))) return null; Object.entries(quest.requirements).forEach(([id, amount]) => inventory.remove(id, amount)); this.completed.push(questId); return quest; }
  toJSON() { return { completed: [...this.completed] }; }
}