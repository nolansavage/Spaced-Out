import { Player } from "./player.js";
import { World } from "./world.js";
import { Farming } from "./farming.js";
import { createHotbar, Inventory } from "./inventory.js";
import { createPlayerStats, restoreEnergy, restoreHealth, takeDamage } from "./stats.js";
import { GameTime } from "./time.js";
import { Ship } from "./ship.js";
import { ShipAI } from "./ai.js";
import { CrewLogs } from "./logs.js";
import { craft } from "./crafting.js";
import { processMaterials } from "./machines.js";
import { createPlacement } from "./customization.js";
import { sellItem } from "./economy.js";
import { Combat } from "./combat.js";
import { Enemies } from "./enemies.js";
import { getPlanetWorld, PLANETS } from "./planets.js";
import { Expeditions } from "./expeditions.js";
import { Discoveries } from "./discoveries.js";
import { getNavigationReport } from "./navigation.js";
import { NPCs, NPC_DEFINITIONS } from "./npcs.js";
import { addFriendship } from "./relationships.js";
import { getDialogue } from "./dialogue.js";
import { Events } from "./events.js";
import { Quests } from "./quests.js";
import { Memories } from "./memories.js";
import { Choices, MAJOR_CHOICES } from "./choices.js";
import { Humanity } from "./humanity.js";
import { evaluateProgression } from "./progression.js";
import { createSettings } from "./settings.js";
import { Tutorial } from "./tutorial.js";

export const GameState = Object.freeze({
  TITLE: "title",
  CREATOR: "creator",
  PLAYING: "playing",
  PAUSED: "paused",
  INVENTORY: "inventory",
  SLEEP_CONFIRM: "sleep-confirm",
  CRAFTING: "crafting",
  NAVIGATION: "navigation",
  DIALOGUE: "dialogue"
});

export class Game {
  constructor({ world, camera, ui, input, onSaveRequested }) {
    this.world = world;
    this.camera = camera;
    this.ui = ui;
    this.input = input;
    this.profile = null;
    this.player = null;
    this.time = null;
    this.stats = null;
    this.inventory = null;
    this.hotbar = [];
    this.selectedHotbarIndex = 0;
    this.farming = null;
    this.ship = null;
    this.ai = null;
    this.logs = null;
    this.placementMode = null;
    this.combat = null;
    this.enemies = null;
    this.shipWorld = world;
    this.expeditions = null;
    this.discoveries = null;
    this.npcs = null;
    this.events = null;
    this.quests = null;
    this.memories = null;
    this.choices = null;
    this.humanity = null;
    this.settings = null;
    this.tutorial = null;
    this.onSaveRequested = onSaveRequested;
    this.state = GameState.TITLE;
  }

  clearInput() {
    for (const key of Object.keys(this.input)) delete this.input[key];
  }

  showTitle(canContinue) {
    this.state = GameState.TITLE;
    this.clearInput();
    this.ui.showTitle(canContinue);
  }

  showCreator() {
    this.state = GameState.CREATOR;
    this.clearInput();
    this.ui.showCreator();
  }

  start(profile, savedGameState = {}) {
    this.profile = profile;
    this.player = new Player(profile, this.world.spawn);
    this.time = new GameTime(savedGameState.time);
    this.stats = createPlayerStats(savedGameState.stats);
    this.inventory = new Inventory(savedGameState.inventory);
    this.hotbar = createHotbar(savedGameState.hotbar);
    this.selectedHotbarIndex = 0;
    this.world.resetEntityStates();
    this.world.runtimeEntities = [];
    this.world.refreshEntityIndexes();
    (savedGameState.placedEntities ?? []).forEach((entity) => this.world.addRuntimeEntity(entity));
    this.world.restoreEntityStates(savedGameState.farmPlots);
    this.farming = new Farming(this.world, this.inventory, this.stats);
    this.ship = new Ship(savedGameState.ship);
    this.ai = new ShipAI(savedGameState.ai);
    this.logs = new CrewLogs(savedGameState.logs);
    this.combat = new Combat(savedGameState.combat);
    this.enemies = new Enemies(savedGameState.enemies);
    this.expeditions = new Expeditions(savedGameState.expeditions);
    this.discoveries = new Discoveries(savedGameState.discoveries);
    this.npcs = new NPCs(savedGameState.npcs);
    this.events = new Events(savedGameState.events);
    this.quests = new Quests(savedGameState.quests);
    this.memories = new Memories(savedGameState.memories);
    this.choices = new Choices(savedGameState.choices);
    this.humanity = new Humanity(savedGameState.humanity);
    this.settings = createSettings(savedGameState.settings);
    this.tutorial = new Tutorial(savedGameState.tutorial);
    this.spawnNPCs();
    if (this.expeditions.activePlanetId) {
      const definition = getPlanetWorld(this.expeditions.activePlanetId);
      if (definition) {
        this.world = new World(definition);
        this.world.restoreEntityStates(this.expeditions.worldStates[this.expeditions.activePlanetId]);
      }
    }
    this.player.x = this.world.spawn.x;
    this.player.y = this.world.spawn.y;
    this.camera.x = 0;
    this.camera.y = this.world.id === "ship" ? 160 : 0;
    this.state = GameState.PLAYING;
    this.clearInput();
    this.ui.showGame(profile);
    if (this.tutorial.showOnce("movement")) this.ui.showMessage("WASD moves. Press E near highlighted ship systems.");
    this.refreshUI();
  }

  togglePause() {
    if (this.state === GameState.PLAYING) {
      this.state = GameState.PAUSED;
      this.clearInput();
      this.ui.showPause(true);
    } else if (this.state === GameState.PAUSED) {
      this.resume();
    }
  }

  resume() {
    if (this.state !== GameState.PAUSED) return;
    this.state = GameState.PLAYING;
    this.clearInput();
    this.ui.showPause(false);
  }

  toggleInventory() {
    if (this.state === GameState.PLAYING) {
      this.state = GameState.INVENTORY;
      this.clearInput();
      this.ui.showInventory(this.inventory);
    } else if (this.state === GameState.INVENTORY) {
      this.state = GameState.PLAYING;
      this.clearInput();
      this.ui.showInventory(null);
    }
  }

  selectHotbar(index) {
    if (!this.acceptsMovementInput() || index < 0 || index >= this.hotbar.length) return;
    this.selectedHotbarIndex = index;
    this.ui.renderHotbar(this.hotbar, this.selectedHotbarIndex, this.inventory);
  }

  interact() {
    if (!this.acceptsMovementInput()) return;
    const target = this.world.getInteractiveObjectNear(this.player, 14);
    if (!target) {
      this.ui.showMessage("Nothing nearby.");
      return;
    }
    if (target.interaction === "rest") {
      this.state = GameState.SLEEP_CONFIRM;
      this.clearInput();
      this.ui.showSleepConfirm(true);
      return;
    }
    if (target.interaction === "farm") {
      const result = this.farming.interact(target, this.hotbar[this.selectedHotbarIndex]);
      this.refreshUI();
      this.ui.showMessage(result.message);
      return;
    }
    if (target.interaction === "salvage") {
      if (target.state.collected) return;
      Object.entries(target.rewards).forEach(([itemId, quantity]) => this.inventory.add(itemId, quantity));
      target.state.collected = true;
      this.refreshUI();
      this.ui.showMessage("Salvage recovered.");
      return;
    }
    if (target.interaction === "repair") {
      const progression = this.progression();
      if (["navigation-core", "research-laboratory", "communication-array", "ai-core"].includes(target.systemId) && !progression.canRestoreAdvanced) { this.ui.showMessage("Advanced restoration requires base repairs and recovered discoveries."); return; }
      const result = this.ship.repair(target.systemId, this.inventory, this.ai);
      const upgrade = !result.changed && target.systemId === "hydroponics-system" && this.ship.state.repairs["hydroponics-system"]
        ? this.ship.upgradeRoom("hydroponics", this.inventory, this.stats)
        : result;
      this.refreshUI();
      if (upgrade.changed && this.progression().canChooseFuture) { this.openChoice(); return; }
      this.ui.showMessage(upgrade.changed ? this.ai.diagnostic(upgrade.message) : upgrade.message);
      return;
    }
    if (target.interaction === "memory") { const memory = this.memories.discover(target.memoryId); if (!memory) return; this.ai.addMemory(10); this.refreshUI(); this.ui.showMessage(`MEMORY: ${memory.title} - ${memory.text}`); return; }
    if (target.interaction === "fabricator") { this.state = GameState.CRAFTING; this.clearInput(); this.ui.showCrafting(true); return; }
    if (target.interaction === "navigation") { this.state = GameState.NAVIGATION; this.clearInput(); this.ui.showNavigation(Object.values(PLANETS)); return; }
    if (target.interaction === "npc") { this.openDialogue(target.npcId); return; }
    if (target.interaction === "processor") { const result = processMaterials(this.inventory); this.refreshUI(); this.ui.showMessage(result.message); return; }
    if (target.interaction === "storage") { const result = sellItem(this.inventory, this.stats, this.hotbar[this.selectedHotbarIndex]); this.refreshUI(); this.ui.showMessage(result.message); return; }
    if (target.interaction === "log") {
      const log = this.logs.discover(target.logId);
      if (!log) { this.ui.showMessage("Log already recovered."); return; }
      target.state.collected = true;
      this.ai.addMemory(log.memory);
      this.refreshUI();
      this.ui.showLog(log);
      return;
    }
    if (target.interaction === "locked") {
      this.ui.showMessage(this.ship.isUnlocked(target.areaId, this.ai.memory) ? "Access restored. Area placeholder sealed." : `LOCKED: ${target.areaId.replace("-", " ")}`);
      return;
    }
    if (target.interaction === "resource") {
      if (target.state.collected) return;
      Object.entries(target.rewards).forEach(([itemId, quantity]) => this.inventory.add(itemId, quantity));
      target.state.collected = true;
      this.refreshUI(); this.ui.showMessage("Expedition resources secured.");
      return;
    }
    if (target.interaction === "discovery") {
      const discovery = this.discoveries.discover(target.discoveryId);
      if (!discovery) return;
      target.state.collected = true;
      this.refreshUI(); this.ui.showMessage(`DISCOVERY: ${discovery.name} - ${discovery.description}`);
      return;
    }
    if (target.interaction === "return") { this.returnToShip(); return; }
    this.ui.showMessage("System unavailable.");
  }

  cancelSleep() {
    if (this.state !== GameState.SLEEP_CONFIRM) return;
    this.state = GameState.PLAYING;
    this.clearInput();
    this.ui.showSleepConfirm(false);
  }

  endDay() {
    if (this.state !== GameState.SLEEP_CONFIRM) return;
    this.farming.processOvernightGrowth();
    this.time.beginNextDay();
    restoreEnergy(this.stats);
    this.state = GameState.PLAYING;
    this.clearInput();
    this.ui.showSleepConfirm(false);
    const result = this.onSaveRequested?.(this.profile, this.getSaveState());
    this.refreshUI();
    this.ui.showMessage(result?.ok === false ? "Day ended. Save unavailable." : "A new day begins.");
  }

  acceptsMovementInput() {
    return this.state === GameState.PLAYING;
  }

  togglePlacement() {
    if (!this.acceptsMovementInput()) return;
    const itemId = this.hotbar[this.selectedHotbarIndex];
    this.placementMode = this.placementMode ? null : itemId;
    this.ui.showMessage(this.placementMode ? "Placement mode: click a clear floor tile." : "Placement cancelled.");
  }

  craftRecipe(recipeId) { if (this.state !== GameState.CRAFTING) return; const result = craft(recipeId, this.inventory); this.refreshUI(); this.ui.showMessage(result.message); }
  closeCrafting() { if (this.state !== GameState.CRAFTING) return; this.state = GameState.PLAYING; this.clearInput(); this.ui.showCrafting(false); }

  selectDestination(planetId) {
    if (this.state !== GameState.NAVIGATION || !PLANETS[planetId]) return;
    this.ui.showNavigation(Object.values(PLANETS), getNavigationReport(planetId));
  }

  launchExpedition(planetId) {
    if (this.state !== GameState.NAVIGATION || !PLANETS[planetId]) return;
    this.expeditions.launch(planetId);
    this.world = new World(getPlanetWorld(planetId));
    this.world.restoreEntityStates(this.expeditions.worldStates[planetId]);
    this.player.x = this.world.spawn.x; this.player.y = this.world.spawn.y;
    this.camera.x = 0; this.camera.y = 0;
    this.state = GameState.PLAYING; this.clearInput(); this.ui.showNavigation(null); this.refreshUI();
    this.ui.showMessage(this.ai.diagnostic(`Expedition launched: ${PLANETS[planetId].name}.`));
  }

  closeNavigation() { if (this.state !== GameState.NAVIGATION) return; this.state = GameState.PLAYING; this.clearInput(); this.ui.showNavigation(null); }

  spawnNPCs() {
    this.shipWorld.runtimeEntities = this.shipWorld.runtimeEntities.filter((entity) => entity.type !== "npc");
    for (const npc of Object.values(NPC_DEFINITIONS)) {
      const location = this.npcs.getLocation(npc.id, this.time.phase);
      this.shipWorld.addRuntimeEntity({ id: `npc-${npc.id}`, type: "npc", npcId: npc.id, x: location.x, y: location.y, width: 10, height: 12, solid: true, interaction: "npc", color: npc.color, state: {} });
    }
  }

  openDialogue(npcId) { const dialogue = getDialogue(npcId, this.npcs.state.friendship[npcId]); if (!dialogue) return; this.state = GameState.DIALOGUE; this.clearInput(); this.ui.showDialogue(NPC_DEFINITIONS[npcId], dialogue); }
  chooseDialogue(npcId, option) {
    if (this.state !== GameState.DIALOGUE) return;
    const relationship = addFriendship(this.npcs, npcId, option.friendship);
    const event = this.events.trigger(npcId, relationship.points);
    this.state = GameState.PLAYING; this.clearInput(); this.ui.showDialogue(null); this.refreshUI();
    this.ui.showMessage(event ? `${event.title}: ${event.text}` : (option.response ?? `${NPC_DEFINITIONS[npcId].name} appreciates your response.`));
  }
  closeDialogue() { if (this.state !== GameState.DIALOGUE) return; this.state = GameState.PLAYING; this.clearInput(); this.ui.showDialogue(null); }

  progression() { return evaluateProgression({ ship: this.ship, ai: this.ai, discoveries: this.discoveries, npcs: this.npcs, memories: this.memories, choices: this.choices }); }
  openChoice() { if (!this.progression().canChooseFuture) return; this.state = GameState.DIALOGUE; this.clearInput(); this.ui.showChoices(Object.values(MAJOR_CHOICES)); }
  chooseFuture(choiceId) { const choice = this.choices.choose(choiceId); if (!choice) return; this.humanity.setStatus(choice.humanity); this.state = GameState.PLAYING; this.ui.showChoices(null); this.refreshUI(); this.ui.showMessage(this.ai.diagnostic(`Directive recorded: ${choice.title}.`)); }

  returnToShip() {
    if (this.world.id === "ship") return;
    const planetId = this.world.id;
    this.expeditions.returnFromPlanet(planetId, this.world.getPersistentEntityStates());
    this.world = this.shipWorld;
    this.player.x = this.world.spawn.x; this.player.y = this.world.spawn.y;
    this.camera.x = 0; this.camera.y = 160;
    this.refreshUI(); this.ui.showMessage(this.ai.diagnostic("Expedition return confirmed."));
  }

  placeAt(x, y) {
    if (!this.placementMode || !this.inventory.has(this.placementMode)) return;
    const entity = createPlacement(this.placementMode, x, y, `placed-${Date.now()}`);
    if (!entity || !this.world.canOccupy(entity.x, entity.y, entity.width, entity.height)) { this.ui.showMessage("Invalid placement."); return; }
    this.inventory.remove(this.placementMode); this.world.addRuntimeEntity(entity); this.placementMode = null; this.refreshUI(); this.ui.showMessage("Object placed.");
  }

  removeAt(x, y) {
    if (!this.placementMode) return;
    const entity = this.world.runtimeEntities.find((item) => x >= item.x && x <= item.x + item.width && y >= item.y && y <= item.y + item.height);
    if (!entity) { this.ui.showMessage("No placed object there."); return; }
    this.world.removeRuntimeEntity(entity.id); this.placementMode = null; this.ui.showMessage("Object removed.");
  }

  fireAt(x, y) {
    if (!this.acceptsMovementInput()) return;
    const result = this.combat.fire(this.hotbar[this.selectedHotbarIndex], this.player, x, y, this.inventory, performance.now());
    this.refreshUI();
    if (!result.changed) this.ui.showMessage(result.message);
  }

  damagePlayer(amount) {
    if (!takeDamage(this.stats, amount)) { this.refreshUI(); return; }
    this.recoverFromDefeat();
  }

  recoverFromDefeat() {
    const scrap = this.inventory.items.find((item) => item.itemId === "scrap");
    if (scrap) this.inventory.remove("scrap", Math.ceil(scrap.quantity / 2));
    this.player.x = 145; this.player.y = 155;
    restoreHealth(this.stats, Math.ceil(this.stats.maxHealth / 2));
    this.clearInput(); this.refreshUI(); this.ui.showMessage(this.ai.diagnostic("Medical recovery protocol engaged."));
  }

  update(deltaTime) {
    if (!this.acceptsMovementInput()) return;
    this.player.update(this.input, this.world, deltaTime);
    this.camera.follow(this.player, this.world, deltaTime);
    const elapsedMinutes = this.time.update(deltaTime);
    if (elapsedMinutes) {
      this.farming.update(elapsedMinutes);
      if (this.world.id === "ship") this.spawnNPCs();
      this.refreshUI();
    }
    if (this.world.id === "ship") {
      const defeated = this.combat.update(deltaTime, this.enemies.enemies);
      defeated.forEach((enemy) => this.enemies.defeat(enemy, this.inventory));
      this.enemies.update(deltaTime, this.player, performance.now(), (damage) => this.damagePlayer(damage));
      if (defeated.length) { this.refreshUI(); this.ui.showMessage("Threat neutralized. Materials recovered."); }
    }
  }

  draw(context) {
    this.world.draw(context, this.camera, this.ship, this.ai);
    if (this.world.id === "ship") { this.enemies?.draw(context, this.camera); this.combat?.draw(context, this.camera); }
    if (this.player) this.player.draw(context, this.camera);
  }

  getSaveState() {
    if (this.world !== this.shipWorld) this.expeditions.worldStates[this.world.id] = this.world.getPersistentEntityStates();
    return {
      time: this.time?.toJSON(),
      stats: this.stats ? { ...this.stats } : undefined,
      inventory: this.inventory?.toJSON(),
      hotbar: [...this.hotbar],
      farmPlots: this.shipWorld.getPersistentEntityStates(),
      ship: this.ship?.toJSON(),
      ai: this.ai?.toJSON(),
      logs: this.logs?.toJSON()
      ,placedEntities: this.world.runtimeEntities.map((entity) => ({ ...entity, initialState: undefined })),
      combat: this.combat?.toJSON(),
      enemies: this.enemies?.toJSON(),
      equipment: { selectedWeapon: this.hotbar[this.selectedHotbarIndex] },
      expeditions: this.expeditions?.toJSON(),
      discoveries: this.discoveries?.toJSON()
      ,npcs: this.npcs?.toJSON(), events: this.events?.toJSON(), quests: this.quests?.toJSON(), memories: this.memories?.toJSON(), choices: this.choices?.toJSON(), humanity: this.humanity?.toJSON()
      ,settings: { ...this.settings }, tutorial: this.tutorial?.toJSON()
    };
  }

  refreshUI() {
    this.ui.updateHud(this.profile, this.time, this.stats);
    this.ui.renderHotbar(this.hotbar, this.selectedHotbarIndex, this.inventory);
    this.ui.updateShipStatus(this.ship?.getStatus(this.ai?.memory ?? 0));
    if (this.state === GameState.INVENTORY) this.ui.renderInventory(this.inventory);
  }
}