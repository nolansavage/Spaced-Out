export const PLACEABLE_DEFINITIONS = {
  "storage-container": { itemId: "storage-container", type: "placedStorage", width: 20, height: 16, solid: true, interaction: "storage", color: "#637d94" },
  chair: { itemId: "chair", type: "chair", width: 10, height: 10, solid: true, interaction: null, color: "#9b7651" },
  table: { itemId: "table", type: "table", width: 18, height: 12, solid: true, interaction: null, color: "#77543d" },
  "plant-decoration": { itemId: "plant-decoration", type: "plantDecoration", width: 12, height: 14, solid: false, interaction: null, color: "#72b05e" },
  "basic-planter": { itemId: "basic-planter", type: "placedPlanter", width: 24, height: 14, solid: false, interaction: "farm", color: "#4d7552" }
};

export function snapToGrid(value, gridSize = 8) { return Math.floor(value / gridSize) * gridSize; }

export function createPlacement(itemId, x, y, id) {
  const definition = PLACEABLE_DEFINITIONS[itemId];
  if (!definition) return null;
  return { id, ...definition, x: snapToGrid(x), y: snapToGrid(y), state: definition.type === "placedPlanter" ? { prepared: false, cropId: null, growthMinutes: 0, growthStage: 0, watered: false } : {} };
}