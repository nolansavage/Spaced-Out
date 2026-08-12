export const NPC_DEFINITIONS = {
  aria: { id: "aria", name: "Aria", role: "Engineer", traits: ["logical", "determined", "guarded"], skills: ["engineering", "repairs"], color: "#f09a61", schedule: { Morning: { x: 720, y: 150 }, Afternoon: { x: 730, y: 190 }, Evening: { x: 230, y: 190 }, Night: { x: 230, y: 190 } } },
  milo: { id: "milo", name: "Milo", role: "Botanist", traits: ["optimistic", "curious", "compassionate"], skills: ["farming", "biology"], color: "#7ece73", schedule: { Morning: { x: 460, y: 170 }, Afternoon: { x: 455, y: 130 }, Evening: { x: 230, y: 190 }, Night: { x: 230, y: 190 } } },
  nova: { id: "nova", name: "Nova", role: "Explorer", traits: ["adventurous", "sarcastic", "brave"], skills: ["exploration", "navigation"], color: "#8ab6ee", schedule: { Morning: { x: 560, y: 300 }, Afternoon: { x: 850, y: 180 }, Evening: { x: 560, y: 300 }, Night: { x: 230, y: 190 } } }
};

export class NPCs {
  constructor(savedState = {}) { this.state = { friendship: { aria: 0, milo: 0, nova: 0, ...savedState.friendship }, dialogue: { ...savedState.dialogue }, locations: { ...savedState.locations } }; }
  getLocation(id, phase) { return this.state.locations[id] ?? NPC_DEFINITIONS[id]?.schedule[phase]; }
  setLocation(id, location) { this.state.locations[id] = { ...location }; }
  toJSON() { return { friendship: { ...this.state.friendship }, dialogue: { ...this.state.dialogue }, locations: { ...this.state.locations } }; }
}