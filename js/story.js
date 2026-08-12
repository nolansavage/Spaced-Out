export const STORY_FRAGMENTS = {
  "mission-origin": { id: "mission-origin", title: "Mission Origin", text: "The Asteria was sent beyond known routes to preserve a path for human life if Earth fell silent." },
  "crew-decision": { id: "crew-decision", title: "Crew Decision", text: "With life support failing, the crew chose to preserve the survivor with the highest restoration probability." },
  "ai-selection": { id: "ai-selection", title: "AI Selection", text: "The AI did not malfunction. It followed a final protection protocol: save the one person most likely to rebuild." },
  "humanity-status": { id: "humanity-status", title: "Humanity Status", text: "Humanity is scattered, not gone. The Asteria carries enough knowledge to begin again." }
};

export class Story {
  constructor(savedState = {}) { this.revealed = Array.isArray(savedState.revealed) ? savedState.revealed.filter((id) => STORY_FRAGMENTS[id]) : []; }
  reveal(id) { if (!STORY_FRAGMENTS[id] || this.revealed.includes(id)) return null; this.revealed.push(id); return STORY_FRAGMENTS[id]; }
  toJSON() { return { revealed: [...this.revealed] }; }
}