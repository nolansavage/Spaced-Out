export const ITEM_DEFINITIONS = {
  scrap: { id: "scrap", name: "Scrap", category: "Resources", stackable: true },
  "ship-components": { id: "ship-components", name: "Ship Components", category: "Resources", stackable: true },
  "processed-metal": { id: "processed-metal", name: "Processed Metal", category: "Resources", stackable: true, sellValue: 8 },
  "organic-material": { id: "organic-material", name: "Organic Material", category: "Resources", stackable: true, sellValue: 4 },
  "advanced-components": { id: "advanced-components", name: "Advanced Components", category: "Resources", stackable: true, sellValue: 30 },
  "unknown-technology": { id: "unknown-technology", name: "Unknown Technology", category: "Resources", stackable: true, sellValue: 50 },
  "storage-container": { id: "storage-container", name: "Storage Container", category: "Tools", stackable: true },
  "repair-kit": { id: "repair-kit", name: "Repair Kit", category: "Tools", stackable: true },
  "basic-planter": { id: "basic-planter", name: "Basic Planter", category: "Tools", stackable: true },
  chair: { id: "chair", name: "Chair", category: "Tools", stackable: true },
  table: { id: "table", name: "Table", category: "Tools", stackable: true },
  "plant-decoration": { id: "plant-decoration", name: "Plant Decoration", category: "Tools", stackable: true },
  "energy-cells": { id: "energy-cells", name: "Energy Cells", category: "Resources", stackable: true },
  "rare-plants": { id: "rare-plants", name: "Rare Plants", category: "Resources", stackable: true, sellValue: 18 },
  "organic-samples": { id: "organic-samples", name: "Organic Samples", category: "Resources", stackable: true, sellValue: 15 },
  "ice-crystals": { id: "ice-crystals", name: "Ice Crystals", category: "Resources", stackable: true, sellValue: 20 },
  "rare-metals": { id: "rare-metals", name: "Rare Metals", category: "Resources", stackable: true, sellValue: 25 },
  "rare-minerals": { id: "rare-minerals", name: "Rare Minerals", category: "Resources", stackable: true, sellValue: 35 },
  "farming-tool": { id: "farming-tool", name: "Farming Tool", category: "Tools", stackable: false },
  "glowberry-seeds": { id: "glowberry-seeds", name: "Glowberry Seeds", category: "Seeds", stackable: true },
  "watering-tool": { id: "watering-tool", name: "Watering Tool", category: "Tools", stackable: false },
  "emergency-pistol": { id: "emergency-pistol", name: "Emergency Pistol", category: "Tools", stackable: false },
  scanner: { id: "scanner", name: "Scanner", category: "Tools", stackable: false },
  "mining-tool": { id: "mining-tool", name: "Mining Tool", category: "Tools", stackable: false },
  glowberry: { id: "glowberry", name: "Glowberry", category: "Crops", stackable: true, sellValue: 12 }
};

export function getItemDefinition(itemId) {
  return ITEM_DEFINITIONS[itemId] ?? null;
}

export function createStarterItems() {
  return [
    { itemId: "farming-tool", quantity: 1 },
    { itemId: "glowberry-seeds", quantity: 5 },
    { itemId: "watering-tool", quantity: 1 },
    { itemId: "emergency-pistol", quantity: 1 },
    { itemId: "energy-cells", quantity: 12 },
    { itemId: "scanner", quantity: 1 },
    { itemId: "mining-tool", quantity: 1 }
  ];
}

export function createStarterHotbar() {
  return ["farming-tool", "glowberry-seeds", "watering-tool", "emergency-pistol", "scanner", "mining-tool", null, null];
}