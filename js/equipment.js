export const EQUIPMENT_DEFINITIONS = {
  "emergency-pistol": { id: "emergency-pistol", name: "Emergency Pistol", type: "weapon", damage: 10, cooldown: 400, ammoItemId: "energy-cells", range: 130, projectileSpeed: 170 }
};

export function getEquipment(itemId) { return EQUIPMENT_DEFINITIONS[itemId] ?? null; }