export const RECIPES = {
  "storage-container": { id: "storage-container", name: "Storage Container", materials: { scrap: 4, "processed-metal": 1 }, output: "storage-container", craftingTime: 0 },
  "repair-kit": { id: "repair-kit", name: "Repair Kit", materials: { scrap: 2, "ship-components": 1 }, output: "repair-kit", craftingTime: 0 },
  "basic-planter": { id: "basic-planter", name: "Basic Planter", materials: { scrap: 3, "organic-material": 2 }, output: "basic-planter", craftingTime: 0 },
  chair: { id: "chair", name: "Chair", materials: { scrap: 2 }, output: "chair", craftingTime: 0 },
  table: { id: "table", name: "Table", materials: { scrap: 3 }, output: "table", craftingTime: 0 },
  "plant-decoration": { id: "plant-decoration", name: "Plant Decoration", materials: { "organic-material": 2 }, output: "plant-decoration", craftingTime: 0 }
};

export function craft(recipeId, inventory) {
  const recipe = RECIPES[recipeId];
  if (!recipe) return { changed: false, message: "Unknown recipe." };
  if (!Object.entries(recipe.materials).every(([id, quantity]) => inventory.has(id, quantity))) return { changed: false, message: "Materials required." };
  Object.entries(recipe.materials).forEach(([id, quantity]) => inventory.remove(id, quantity));
  inventory.add(recipe.output);
  return { changed: true, message: `${recipe.name} fabricated.` };
}