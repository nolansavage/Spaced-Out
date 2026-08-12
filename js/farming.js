import { spendEnergy } from "./stats.js";

export const CROP_DEFINITIONS = {
	glowberry: {
		id: "glowberry",
		name: "Glowberry",
		seedItemId: "glowberry-seeds",
		harvestItemId: "glowberry",
		growthDuration: 240,
		growthStages: 3
	}
};

const PREPARE_ENERGY_COST = 4;
const WATER_ENERGY_COST = 2;

export class Farming {
	constructor(world, inventory, stats) {
		this.world = world;
		this.inventory = inventory;
		this.stats = stats;
	}

	update(elapsedMinutes) {
		if (elapsedMinutes <= 0) return false;
		let changed = false;
		for (const plot of this.world.getEntitiesByType("farmPlot")) {
			const state = plot.state;
			const crop = CROP_DEFINITIONS[state.cropId];
			if (!crop || !state.watered || state.growthStage >= crop.growthStages) continue;
			state.growthMinutes = Math.min(crop.growthDuration, state.growthMinutes + elapsedMinutes);
			state.growthStage = Math.min(crop.growthStages, Math.floor((state.growthMinutes / crop.growthDuration) * crop.growthStages));
			changed = true;
		}
		return changed;
	}

	interact(plot, selectedItemId) {
		const state = plot.state;
		const crop = CROP_DEFINITIONS[state.cropId];

		if (crop && state.growthStage >= crop.growthStages) {
			if (!this.inventory.add(crop.harvestItemId)) return { changed: false, message: "Inventory full." };
			this.resetPlot(plot);
			return { changed: true, message: `Harvested ${crop.name}.` };
		}
		if (!state.prepared && selectedItemId === "farming-tool") {
			if (!spendEnergy(this.stats, PREPARE_ENERGY_COST)) return { changed: false, message: "Not enough energy." };
			state.prepared = true;
			return { changed: true, message: "Plot prepared." };
		}
		if (state.prepared && !state.cropId && selectedItemId === "glowberry-seeds") {
			if (!this.inventory.remove("glowberry-seeds")) return { changed: false, message: "No Glowberry seeds." };
			state.cropId = "glowberry";
			state.growthMinutes = 0;
			state.growthStage = 0;
			state.watered = false;
			return { changed: true, message: "Glowberry planted." };
		}
		if (crop && !state.watered && selectedItemId === "watering-tool") {
			if (!spendEnergy(this.stats, WATER_ENERGY_COST)) return { changed: false, message: "Not enough energy." };
			state.watered = true;
			return { changed: true, message: "Crop watered." };
		}
		return { changed: false, message: this.getHint(state, crop) };
	}

	processOvernightGrowth() {
		return this.update(8 * 60);
	}

	resetPlot(plot) {
		plot.state = { prepared: false, cropId: null, growthMinutes: 0, growthStage: 0, watered: false };
	}

	getHint(state, crop) {
		if (!state.prepared) return "Select the Farming Tool.";
		if (!state.cropId) return "Select Glowberry Seeds.";
		if (crop && !state.watered) return "Select the Watering Tool.";
		return "The crop is growing.";
	}
}