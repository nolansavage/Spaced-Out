export const DISCOVERY_DEFINITIONS = {
  "astra-01-signal": { id: "astra-01-signal", name: "Forest Signal", description: "A repeating signal matches a damaged navigation archive." },
  "kryos-7-signal": { id: "kryos-7-signal", name: "Frozen Record", description: "An abandoned structure carries an incomplete expedition designation." },
  "vulcan-9-signal": { id: "vulcan-9-signal", name: "Volcanic Trace", description: "A heat-scarred beacon repeats an unidentified ship registry." }
};

export class Discoveries {
  constructor(savedState = {}) { this.discovered = Array.isArray(savedState.discovered) ? savedState.discovered.filter((id) => DISCOVERY_DEFINITIONS[id]) : []; }
  discover(id) { if (!DISCOVERY_DEFINITIONS[id] || this.discovered.includes(id)) return null; this.discovered.push(id); return DISCOVERY_DEFINITIONS[id]; }
  toJSON() { return { discovered: [...this.discovered] }; }
}