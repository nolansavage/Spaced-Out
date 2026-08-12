export const LOG_DEFINITIONS = {
  "power-shift": { id: "power-shift", title: "Power Shift Record", text: "Power draw exceeds projected reserves. Archive remaining personnel records.", memory: 10 },
  "missing-roster": { id: "missing-roster", title: "Roster Fragment", text: "[CORRUPTED] ...do not wake the remaining passenger until...", memory: 10 }
};

export class CrewLogs {
  constructor(savedState = {}) { this.discovered = Array.isArray(savedState.discovered) ? savedState.discovered.filter((id) => LOG_DEFINITIONS[id]) : []; }
  discover(logId) {
    const log = LOG_DEFINITIONS[logId];
    if (!log || this.discovered.includes(logId)) return null;
    this.discovered.push(logId);
    return log;
  }
  toJSON() { return { discovered: [...this.discovered] }; }
}