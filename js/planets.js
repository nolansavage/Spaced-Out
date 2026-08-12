export const PLANETS = {
  "astra-01": { id: "astra-01", name: "Astra-01", environment: "Alien Forest", difficulty: "Easy", risk: "Low", description: "Strange vegetation surrounds a silent landing site.", resources: ["Organic Material", "Rare Plants", "Organic Samples"], hazards: ["Unknown creatures", "Dense growth"] },
  "kryos-7": { id: "kryos-7", name: "Kryos-7", environment: "Frozen Planet", difficulty: "Medium", risk: "Medium", description: "Ice-covered ruins vanish into limited visibility.", resources: ["Ice Crystals", "Rare Metals"], hazards: ["Extreme cold", "Limited visibility"] },
  "vulcan-9": { id: "vulcan-9", name: "Vulcan-9", environment: "Volcanic Planet", difficulty: "Hard", risk: "High", description: "Unstable terrain conceals valuable components.", resources: ["Advanced Components", "Rare Minerals"], hazards: ["Heat", "Unstable terrain"] }
};

const PLANET_STYLES = {
  "astra-01": { color: "#315342", node: "#8cc95e" },
  "kryos-7": { color: "#405c73", node: "#9ee8ff" },
  "vulcan-9": { color: "#6a3f35", node: "#ffb04c" }
};

export function getPlanetWorld(planetId) {
  const planet = PLANETS[planetId];
  const style = PLANET_STYLES[planetId];
  if (!planet || !style) return null;
  const rewards = planetId === "astra-01" ? { "organic-material": 2, "rare-plants": 1, "organic-samples": 1 }
    : planetId === "kryos-7" ? { "ice-crystals": 2, "rare-metals": 1 }
      : { "advanced-components": 1, "rare-minerals": 2 };
  return {
    id: planetId,
    width: 640,
    height: 420,
    spawn: { x: 100, y: 250 },
    rooms: [{ id: "expedition-zone", name: planet.name.toUpperCase(), bounds: { x: 40, y: 50, width: 560, height: 310 }, color: style.color }],
    entities: [
      { id: `${planetId}-return`, type: "returnBeacon", x: 78, y: 230, width: 22, height: 18, solid: false, interaction: "return", color: "#59c7dd", state: {} },
      { id: `${planetId}-resource-a`, type: "resourceNode", x: 280, y: 165, width: 14, height: 14, solid: false, interaction: "resource", color: style.node, rewards, state: { collected: false } },
      { id: `${planetId}-discovery`, type: "pointOfInterest", x: 450, y: 245, width: 18, height: 16, solid: false, interaction: "discovery", color: "#b56fff", discoveryId: `${planetId}-signal`, state: { collected: false } }
    ]
  };
}