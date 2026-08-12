export class ShipAI {
	constructor(savedState = {}) { this.memory = Math.max(0, Math.min(100, Number.isInteger(savedState.memory) ? savedState.memory : 0)); }
	addMemory(amount) { this.memory = Math.min(100, this.memory + amount); }
	get personality() { return this.memory >= 60 ? "emotional" : this.memory >= 40 ? "protective" : this.memory >= 20 ? "curious" : "analytical"; }
	diagnostic(message = "System diagnostics incomplete.") { return `AI: ${message}`; }
	toJSON() { return { memory: this.memory, personality: this.personality }; }
}