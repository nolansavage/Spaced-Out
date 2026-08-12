export class Tutorial {
  constructor(saved = {}) { this.seen = Array.isArray(saved.seen) ? saved.seen : []; }
  showOnce(id) { if (this.seen.includes(id)) return false; this.seen.push(id); return true; }
  toJSON() { return { seen: [...this.seen] }; }
}