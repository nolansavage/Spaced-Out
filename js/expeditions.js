export class Expeditions {
  constructor(savedState = {}) {
    this.discoveredPlanets = Array.isArray(savedState.discoveredPlanets) ? savedState.discoveredPlanets : [];
    this.activePlanetId = savedState.activePlanetId ?? null;
    this.results = Array.isArray(savedState.results) ? savedState.results : [];
    this.worldStates = savedState.worldStates && typeof savedState.worldStates === "object" ? { ...savedState.worldStates } : {};
  }
  launch(planetId) { this.activePlanetId = planetId; if (!this.discoveredPlanets.includes(planetId)) this.discoveredPlanets.push(planetId); }
  returnFromPlanet(planetId, state) { this.worldStates[planetId] = state; this.results.push({ planetId, returnedAt: Date.now() }); this.activePlanetId = null; }
  toJSON() { return { discoveredPlanets: [...this.discoveredPlanets], activePlanetId: this.activePlanetId, results: [...this.results], worldStates: { ...this.worldStates } }; }
}