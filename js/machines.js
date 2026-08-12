export const MACHINE_DEFINITIONS = {
  fabricator: { id: "fabricator", name: "Fabricator", interaction: "fabricator" },
  "resource-processor": { id: "resource-processor", name: "Resource Processor", interaction: "processor", input: { scrap: 2 }, output: { "processed-metal": 1 }, processingTime: 0 }
};

export function processMaterials(inventory) {
  const machine = MACHINE_DEFINITIONS["resource-processor"];
  if (!Object.entries(machine.input).every(([id, quantity]) => inventory.has(id, quantity))) return { changed: false, message: "Scrap required." };
  Object.entries(machine.input).forEach(([id, quantity]) => inventory.remove(id, quantity));
  Object.entries(machine.output).forEach(([id, quantity]) => inventory.add(id, quantity));
  return { changed: true, message: "Processed Metal produced." };
}