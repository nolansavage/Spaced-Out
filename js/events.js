export const CHARACTER_EVENTS = {
  "aria-memory": { npcId: "aria", threshold: 25, title: "Impossible Familiarity", text: "Aria identifies a damaged panel by touch, then insists she has never seen it.", reward: 5 },
  "milo-sample": { npcId: "milo", threshold: 25, title: "Unusual Sample", text: "Milo finds a plant sample with an incomplete mission stamp.", reward: 5 },
  "nova-signal": { npcId: "nova", threshold: 25, title: "Moving Signal", text: "Nova's signal appears in a sector marked empty by navigation records.", reward: 5 }
};

export class Events {
  constructor(savedState = {}) { this.completed = Array.isArray(savedState.completed) ? savedState.completed : []; }
  trigger(npcId, friendship) { const event = Object.values(CHARACTER_EVENTS).find((entry) => entry.npcId === npcId && friendship >= entry.threshold && !this.completed.includes(entry.title)); if (!event) return null; this.completed.push(event.title); return event; }
  toJSON() { return { completed: [...this.completed] }; }
}