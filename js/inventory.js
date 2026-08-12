import { createStarterHotbar, createStarterItems, getItemDefinition } from "./items.js";

export const HOTBAR_SIZE = 8;

export class Inventory {
	constructor(savedItems = createStarterItems()) {
		this.items = [];
		for (const item of savedItems) this.add(item.itemId, item.quantity);
	}

	add(itemId, quantity = 1) {
		const definition = getItemDefinition(itemId);
		if (!definition || !Number.isInteger(quantity) || quantity <= 0) return false;
		const existing = this.items.find((item) => item.itemId === itemId);
		if (existing && definition.stackable) existing.quantity += quantity;
		else if (existing) return false;
		else this.items.push({ itemId, quantity });
		return true;
	}

	remove(itemId, quantity = 1) {
		const item = this.items.find((entry) => entry.itemId === itemId);
		if (!item || !Number.isInteger(quantity) || quantity <= 0 || item.quantity < quantity) return false;
		item.quantity -= quantity;
		if (!item.quantity) this.items = this.items.filter((entry) => entry !== item);
		return true;
	}

	has(itemId, quantity = 1) {
		return (this.items.find((item) => item.itemId === itemId)?.quantity ?? 0) >= quantity;
	}

	getCategories() {
		return ["Resources", "Seeds", "Crops", "Tools"].map((category) => ({
			category,
			items: this.items.filter((item) => getItemDefinition(item.itemId)?.category === category)
		}));
	}

	toJSON() {
		return this.items.map((item) => ({ ...item }));
	}
}

export function createHotbar(savedHotbar = createStarterHotbar()) {
	const hotbar = Array.from({ length: HOTBAR_SIZE }, (_, index) => savedHotbar[index] ?? null);
	return hotbar.map((itemId) => getItemDefinition(itemId) ? itemId : null);
}