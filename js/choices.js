export const MAJOR_CHOICES = {
  "restore-protocols": { id: "restore-protocols", title: "Restore Original Protocols", description: "Preserve the AI's remaining original directives.", personality: "analytical", humanity: "Hopeful" },
  "modify-protocols": { id: "modify-protocols", title: "Modify AI Protocols", description: "Prioritize the living crew of the present.", personality: "protective", humanity: "Rebuilding" },
  "search-survivors": { id: "search-survivors", title: "Search for Survivors", description: "Dedicate future navigation to distant signals.", personality: "curious", humanity: "Hopeful" }
};

export class Choices {
  constructor(savedState = {}) { this.selected = savedState.selected && MAJOR_CHOICES[savedState.selected] ? savedState.selected : null; }
  choose(id) { if (this.selected || !MAJOR_CHOICES[id]) return null; this.selected = id; return MAJOR_CHOICES[id]; }
  toJSON() { return { selected: this.selected }; }
}