import { getItemDefinition } from "./items.js";

export function sellItem(inventory, stats, itemId) {
  const item = getItemDefinition(itemId);
  if (!item?.sellValue || !inventory.remove(itemId)) return { changed: false, message: "Item cannot be sold." };
  stats.credits += item.sellValue;
  return { changed: true, message: `Sold ${item.name} for ${item.sellValue} credits.` };
}