export const MEMORY_FRAGMENTS = {
  "emergency-protocol": { id: "emergency-protocol", title: "Emergency Protocol", source: "Navigation Core", importance: "major", text: "The ship entered an unexpected situation. Emergency priorities were revised." },
  "captain-final-log": { id: "captain-final-log", title: "Captain's Final Log", source: "Communication Array", importance: "major", text: "The crew faced a decision with no complete record of its outcome." },
  "ai-override": { id: "ai-override", title: "AI Override", source: "AI Core", importance: "major", text: "Unusual instructions were issued to the ship intelligence. Authorization is corrupted." }
};

export class Memories {
  constructor(savedState = {}) { this.discovered = Array.isArray(savedState.discovered) ? savedState.discovered.filter((id) => MEMORY_FRAGMENTS[id]) : []; }
  discover(id) { if (!MEMORY_FRAGMENTS[id] || this.discovered.includes(id)) return null; this.discovered.push(id); return MEMORY_FRAGMENTS[id]; }
  toJSON() { return { discovered: [...this.discovered] }; }
}