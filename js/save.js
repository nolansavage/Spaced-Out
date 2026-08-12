import { APPEARANCES, PROFESSIONS, SUIT_COLORS } from "./character-creator.js";
import { HOTBAR_SIZE } from "./inventory.js";
import { createStarterHotbar, createStarterItems, getItemDefinition } from "./items.js";
import { createPlayerStats } from "./stats.js";
import { createTimeState } from "./time.js";
import { Ship } from "./ship.js";
import { ShipAI } from "./ai.js";
import { CrewLogs } from "./logs.js";

const SAVE_KEY = "spaced-out-save";
const LEGACY_PROFILE_KEY = "spaced-out-profile-v1";
export const SAVE_SCHEMA_VERSION = 9;
const BACKUP_SAVE_KEY = "spaced-out-save-backup";

const professionIds = new Set(PROFESSIONS.map((profession) => profession.id));
const suitColors = new Set(SUIT_COLORS.map((suit) => suit.value));
const appearances = new Set(APPEARANCES);

function createFutureSystemData() {
  return {
    inventory: null,
    crops: null,
    shipUpgrades: null,
    aiProgression: null,
    npcRelationships: null
  };
}

export function createSaveData(character) {
  return {
    schemaVersion: SAVE_SCHEMA_VERSION,
    character,
    gameState: createGameState(),
    futureSystems: createFutureSystemData()
  };
}

export function createGameState(savedState = {}) {
  return {
    time: createTimeState(savedState.time),
    stats: createPlayerStats(savedState.stats),
    inventory: Array.isArray(savedState.inventory) ? savedState.inventory.map((item) => ({ ...item })) : createStarterItems(),
    hotbar: Array.isArray(savedState.hotbar) ? [...savedState.hotbar] : createStarterHotbar(),
    farmPlots: savedState.farmPlots && typeof savedState.farmPlots === "object" ? { ...savedState.farmPlots } : {},
    ship: new Ship(savedState.ship).toJSON(),
    ai: new ShipAI(savedState.ai).toJSON(),
    logs: new CrewLogs(savedState.logs).toJSON()
    ,placedEntities: Array.isArray(savedState.placedEntities) ? savedState.placedEntities.map((entity) => ({ ...entity })) : [],
    combat: savedState.combat && typeof savedState.combat === "object" ? { ...savedState.combat } : {},
    enemies: savedState.enemies && typeof savedState.enemies === "object" ? { ...savedState.enemies } : { defeated: [], discoveredAreas: [] },
    equipment: savedState.equipment && typeof savedState.equipment === "object" ? { ...savedState.equipment } : {},
    expeditions: savedState.expeditions && typeof savedState.expeditions === "object" ? { ...savedState.expeditions } : { discoveredPlanets: [], activePlanetId: null, results: [], worldStates: {} },
    discoveries: savedState.discoveries && typeof savedState.discoveries === "object" ? { ...savedState.discoveries } : { discovered: [] }
    ,npcs: savedState.npcs && typeof savedState.npcs === "object" ? { ...savedState.npcs } : { friendship: {}, dialogue: {}, locations: {} },
    events: savedState.events && typeof savedState.events === "object" ? { ...savedState.events } : { completed: [] },
    quests: savedState.quests && typeof savedState.quests === "object" ? { ...savedState.quests } : { completed: [] }
    ,memories: savedState.memories && typeof savedState.memories === "object" ? { ...savedState.memories } : { discovered: [] }, choices: savedState.choices && typeof savedState.choices === "object" ? { ...savedState.choices } : { selected: null }, humanity: savedState.humanity && typeof savedState.humanity === "object" ? { ...savedState.humanity } : { status: "Unknown" }, settings: savedState.settings && typeof savedState.settings === "object" ? { ...savedState.settings } : {}, tutorial: savedState.tutorial && typeof savedState.tutorial === "object" ? { ...savedState.tutorial } : { seen: [] }
  };
}

export function isValidCharacter(character) {
  return Boolean(
    character &&
    typeof character.name === "string" &&
    character.name.trim().length > 0 &&
    character.name.length <= 18 &&
    suitColors.has(character.suitColor) &&
    appearances.has(character.appearance) &&
    professionIds.has(character.profession) &&
    Number.isFinite(character.createdAt)
  );
}

function isValidSaveData(saveData) {
  return Boolean(
    saveData &&
    saveData.schemaVersion === SAVE_SCHEMA_VERSION &&
    isValidCharacter(saveData.character) &&
    isValidGameState(saveData.gameState) &&
    saveData.futureSystems &&
    Object.hasOwn(saveData.futureSystems, "inventory") &&
    Object.hasOwn(saveData.futureSystems, "crops") &&
    Object.hasOwn(saveData.futureSystems, "shipUpgrades") &&
    Object.hasOwn(saveData.futureSystems, "aiProgression") &&
    Object.hasOwn(saveData.futureSystems, "npcRelationships")
  );
}

function isValidGameState(gameState) {
  if (!gameState || !Number.isInteger(gameState.time?.day) || gameState.time.day < 1 ||
    !Number.isInteger(gameState.time?.minutes) || gameState.time.minutes < 0 || gameState.time.minutes >= 1440 ||
    !Number.isInteger(gameState.stats?.maxEnergy) || gameState.stats.maxEnergy < 1 ||
    !Number.isInteger(gameState.stats?.maxHealth) || gameState.stats.maxHealth < 1 || !Number.isInteger(gameState.stats?.health) || gameState.stats.health < 0 || gameState.stats.health > gameState.stats.maxHealth ||
    !Number.isInteger(gameState.stats?.energy) || gameState.stats.energy < 0 || gameState.stats.energy > gameState.stats.maxEnergy ||
    !Number.isInteger(gameState.stats?.credits) || gameState.stats.credits < 0 ||
    !Array.isArray(gameState.inventory) || !Array.isArray(gameState.hotbar) || gameState.hotbar.length !== HOTBAR_SIZE ||
    !gameState.farmPlots || typeof gameState.farmPlots !== "object" || !gameState.ship || !gameState.ai || !gameState.logs || !Array.isArray(gameState.placedEntities) || !gameState.combat || !gameState.enemies || !gameState.equipment || !gameState.expeditions || !gameState.discoveries || !gameState.npcs || !gameState.events || !gameState.quests || !gameState.memories || !gameState.choices || !gameState.humanity || !gameState.settings || !gameState.tutorial) return false;

  const itemIds = new Set();
  for (const item of gameState.inventory) {
    if (!getItemDefinition(item?.itemId) || !Number.isInteger(item.quantity) || item.quantity < 1 || itemIds.has(item.itemId)) return false;
    itemIds.add(item.itemId);
  }
  return gameState.hotbar.every((itemId) => itemId === null || Boolean(getItemDefinition(itemId)));
}

function migrateSaveData(saveData) {
  let migratedData = saveData;
  while (migratedData?.schemaVersion < SAVE_SCHEMA_VERSION) {
    const migration = SAVE_MIGRATIONS[migratedData.schemaVersion];
    if (!migration) return null;
    migratedData = migration(migratedData);
  }
  return migratedData;
}

const SAVE_MIGRATIONS = {
  1: (saveData) => ({
    schemaVersion: 2,
    character: saveData.character,
    gameState: createGameState(),
    futureSystems: saveData.futureSystems ?? createFutureSystemData()
  }),
  2: (saveData) => ({
    schemaVersion: 3,
    character: saveData.character,
    gameState: createGameState(saveData.gameState),
    futureSystems: saveData.futureSystems ?? createFutureSystemData()
  }),
  3: (saveData) => ({ schemaVersion: 4, character: saveData.character, gameState: createGameState(saveData.gameState), futureSystems: saveData.futureSystems ?? createFutureSystemData() }),
  4: (saveData) => ({
    schemaVersion: 5,
    character: saveData.character,
    gameState: createGameState({
      ...saveData.gameState,
      inventory: saveData.gameState.inventory.some((item) => item.itemId === "energy-cells")
        ? saveData.gameState.inventory
        : [...saveData.gameState.inventory, { itemId: "energy-cells", quantity: 12 }]
    }),
    futureSystems: saveData.futureSystems ?? createFutureSystemData()
  }),
  5: (saveData) => ({ schemaVersion: 6, character: saveData.character, gameState: createGameState(saveData.gameState), futureSystems: saveData.futureSystems ?? createFutureSystemData() }),
  6: (saveData) => ({ schemaVersion: 7, character: saveData.character, gameState: createGameState(saveData.gameState), futureSystems: saveData.futureSystems ?? createFutureSystemData() }),
  7: (saveData) => ({ schemaVersion: 8, character: saveData.character, gameState: createGameState(saveData.gameState), futureSystems: saveData.futureSystems ?? createFutureSystemData() })
  ,8: (saveData) => ({ schemaVersion: 9, character: saveData.character, gameState: createGameState(saveData.gameState), futureSystems: saveData.futureSystems ?? createFutureSystemData() })
};

function safeRead(key) {
  try {
    return { value: localStorage.getItem(key), error: null };
  } catch (error) {
    return { value: null, error };
  }
}

function safeWrite(key, value) {
  try {
    localStorage.setItem(key, value);
    return { ok: true, error: null };
  } catch (error) {
    return { ok: false, error };
  }
}

function parseSave(value) {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export function loadSaveData() {
  const currentSave = safeRead(SAVE_KEY);
  if (currentSave.error) return { data: null, error: currentSave.error };

  for (const value of [currentSave.value, safeRead(BACKUP_SAVE_KEY).value]) {
    const migratedSave = migrateSaveData(parseSave(value));
    if (migratedSave && isValidSaveData(migratedSave)) return { data: migratedSave, error: null };
  }
  if (currentSave.value) return { data: null, error: new Error("Saved data is invalid.") };

  const legacyProfile = safeRead(LEGACY_PROFILE_KEY);
  const profile = parseSave(legacyProfile.value);
  if (!legacyProfile.error && isValidCharacter(profile)) return { data: createSaveData(profile), error: null };
  return { data: null, error: legacyProfile.error };
}

export function saveGame(character, gameState) {
  if (!isValidCharacter(character)) return { ok: false, error: new Error("Character data is invalid.") };
  const saveData = createSaveData(character);
  saveData.gameState = createGameState(gameState);
  if (!isValidGameState(saveData.gameState)) return { ok: false, error: new Error("Game data is invalid.") };
  const serialized = JSON.stringify(saveData);
  const result = safeWrite(SAVE_KEY, serialized);
  if (result.ok) safeWrite(BACKUP_SAVE_KEY, serialized);
  return result;
}

export function saveCharacter(character) {
  return saveGame(character, createGameState());
}