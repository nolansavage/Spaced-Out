export const ENDGAME_OBJECTIVES = [
  { id: "restore-communication-array", title: "Restore the Communication Array", description: "Reconnect the ship to unknown signals." },
  { id: "recover-mission-data", title: "Recover Missing Crew Data", description: "Find fragments of the original mission." },
  { id: "decide-ship-future", title: "Decide the Future of the Ship", description: "Choose how the restored AI will guide humanity." }
];

export class EndgameQuests {
  constructor(savedState = {}) { this.completed = Array.isArray(savedState.completed) ? savedState.completed : []; }
  complete(id) { if (!ENDGAME_OBJECTIVES.some((objective) => objective.id === id) || this.completed.includes(id)) return false; this.completed.push(id); return true; }
  toJSON() { return { completed: [...this.completed] }; }
}