export const WORLD_WIDTH = 960;
export const WORLD_HEIGHT = 576;

const ROOMS = [
  { id: "living-quarters", name: "EMERGENCY LIVING QUARTERS", bounds: { x: 70, y: 72, width: 226, height: 178 }, color: "#1d3b48" },
  { id: "hydroponics", name: "HYDROPONICS BAY", bounds: { x: 350, y: 72, width: 260, height: 178 }, color: "#254537" },
  { id: "engineering", name: "ENGINEERING ROOM", bounds: { x: 664, y: 72, width: 226, height: 178 }, color: "#483629" },
  { id: "main-corridor", name: "MAIN CORRIDOR", bounds: { x: 70, y: 250, width: 820, height: 110 }, color: "#263243" }
];

const ENTITY_DEFINITIONS = {
  bed: { width: 46, height: 22, color: "#526677", solid: true, interaction: "rest" },
  storage: { width: 32, height: 42, color: "#334a58", solid: true, interaction: "storage" },
  farmPlot: {
    width: 48,
    height: 16,
    color: "#4d7552",
    solid: false,
    interaction: "farm",
    state: { prepared: false, cropId: null, growthMinutes: 0, growthStage: 0, watered: false }
  },
  repairStation: { width: 74, height: 34, color: "#5d4631", solid: true, interaction: "repair" },
  console: { width: 64, height: 50, color: "#303d4f", solid: true, interaction: "repair" },
  salvage: { width: 12, height: 10, color: "#9b7651", solid: false, interaction: "salvage", state: { collected: false } },
  crewLog: { width: 10, height: 12, color: "#b56fff", solid: false, interaction: "log", state: { collected: false } },
  lockedDoor: { width: 20, height: 8, color: "#7b3945", solid: true, interaction: "locked", state: { opened: false } },
  fabricator: { width: 34, height: 24, color: "#5c6b9c", solid: true, interaction: "fabricator" },
  processor: { width: 30, height: 22, color: "#6b7683", solid: true, interaction: "processor" },
  navigationConsole: { width: 26, height: 20, color: "#69d9ff", solid: true, interaction: "navigation" },
  npc: { width: 10, height: 12, color: "#ffffff", solid: true, interaction: "npc", state: {} },
  memoryTerminal: { width: 16, height: 18, color: "#b56fff", solid: true, interaction: "memory" },
  corridorLight: { width: 44, height: 7, color: "#59c7dd", solid: false, interaction: null },
  warningLight: { width: 44, height: 7, color: "#f0a43a", solid: false, interaction: null }
};

const ENTITY_DATA = [
  { id: "player-bed", type: "bed", x: 92, y: 96 },
  { id: "quarters-storage", type: "storage", x: 204, y: 101 },
  { id: "hydroponics-plot-a", type: "farmPlot", x: 373, y: 110 },
  { id: "hydroponics-plot-b", type: "farmPlot", x: 437, y: 110 },
  { id: "hydroponics-plot-c", type: "farmPlot", x: 501, y: 110 },
  { id: "hydroponics-control", type: "repairStation", x: 530, y: 170, systemId: "hydroponics-system" },
  { id: "repair-station", type: "repairStation", x: 690, y: 102, systemId: "emergency-power" },
  { id: "engineering-console", type: "console", x: 786, y: 102, systemId: "life-support" },
  { id: "fabricator", type: "fabricator", x: 700, y: 170 },
  { id: "resource-processor", type: "processor", x: 760, y: 180 },
  { id: "navigation-console", type: "navigationConsole", x: 850, y: 150 },
  { id: "navigation-core", type: "repairStation", x: 830, y: 110, systemId: "navigation-core" },
  { id: "research-laboratory", type: "repairStation", x: 600, y: 140, systemId: "research-laboratory" },
  { id: "communication-array", type: "repairStation", x: 580, y: 300, systemId: "communication-array" },
  { id: "ai-core", type: "repairStation", x: 760, y: 250, systemId: "ai-core" },
  { id: "memory-protocol", type: "memoryTerminal", x: 680, y: 285, memoryId: "emergency-protocol" },
  { id: "memory-captain", type: "memoryTerminal", x: 620, y: 220, memoryId: "captain-final-log" },
  { id: "memory-override", type: "memoryTerminal", x: 800, y: 280, memoryId: "ai-override" },
  { id: "salvage-living", type: "salvage", x: 155, y: 180, rewards: { scrap: 4, "ship-components": 1 } },
  { id: "salvage-corridor", type: "salvage", x: 300, y: 290, rewards: { scrap: 3, "ship-components": 1 } },
  { id: "salvage-engineering", type: "salvage", x: 650, y: 220, rewards: { scrap: 4, "ship-components": 1 } },
  { id: "log-power-shift", type: "crewLog", x: 270, y: 195, logId: "power-shift" },
  { id: "log-missing-roster", type: "crewLog", x: 620, y: 286, logId: "missing-roster" },
  { id: "door-research-wing", type: "lockedDoor", x: 500, y: 348, areaId: "research-wing" },
  { id: "door-reactor-core", type: "lockedDoor", x: 820, y: 348, areaId: "reactor-core" },
  { id: "door-crew-quarters", type: "lockedDoor", x: 170, y: 348, areaId: "crew-quarters" },
  { id: "corridor-light-west", type: "corridorLight", x: 100, y: 324 },
  { id: "corridor-light-center", type: "warningLight", x: 414, y: 324 },
  { id: "corridor-light-east", type: "corridorLight", x: 716, y: 324 }
];

function intersects(first, second) {
  return first.x < second.x + second.width &&
    first.x + first.width > second.x &&
    first.y < second.y + second.height &&
    first.y + first.height > second.y;
}

export class World {
  constructor(definition = null) {
    this.id = definition?.id ?? "ship";
    this.width = definition?.width ?? WORLD_WIDTH;
    this.height = definition?.height ?? WORLD_HEIGHT;
    this.spawn = definition?.spawn ?? { x: 170, y: 287 };
    this.rooms = definition?.rooms ?? ROOMS;
    const entityData = definition?.entities ?? ENTITY_DATA;
    this.entities = entityData.map((entity) => {
      const definition = ENTITY_DEFINITIONS[entity.type] ?? {};
      const state = definition.state || entity.state ? { ...definition.state, ...entity.state } : null;
      return { ...definition, ...entity, state, initialState: state ? { ...state } : null };
    });
    this.runtimeEntities = [];
    this.refreshEntityIndexes();
  }

  refreshEntityIndexes() {
    this.allEntities = [...this.entities, ...this.runtimeEntities];
    this.collisionObjects = this.allEntities.filter((entity) => entity.solid);
    this.interactiveObjects = this.allEntities.filter((entity) => entity.interaction);
  }

  addRuntimeEntity(entity) { this.runtimeEntities.push({ ...entity, initialState: { ...entity.state } }); this.refreshEntityIndexes(); }
  removeRuntimeEntity(id) { this.runtimeEntities = this.runtimeEntities.filter((entity) => entity.id !== id); this.refreshEntityIndexes(); }

  canOccupy(x, y, width, height) {
    const inset = 3;
    const isInWalkableRoom = [
      [x + inset, y + inset],
      [x + width - inset, y + inset],
      [x + inset, y + height - inset],
      [x + width - inset, y + height - inset]
    ].every(([pointX, pointY]) => this.rooms.some((room) => (
      pointX >= room.bounds.x && pointX < room.bounds.x + room.bounds.width &&
      pointY >= room.bounds.y && pointY < room.bounds.y + room.bounds.height
    )));
    return isInWalkableRoom && !this.collisionObjects.some((object) => intersects({ x, y, width, height }, object));
  }

  getInteractiveObjectNear(bounds, range = 12) {
    const searchBounds = {
      x: bounds.x - range,
      y: bounds.y - range,
      width: bounds.width + range * 2,
      height: bounds.height + range * 2
    };
    return this.interactiveObjects.filter((object) => intersects(searchBounds, object)).sort((first, second) => {
      const firstDistance = Math.hypot(first.x - bounds.x, first.y - bounds.y);
      const secondDistance = Math.hypot(second.x - bounds.x, second.y - bounds.y);
      return firstDistance - secondDistance;
    })[0] ?? null;
  }

  getEntitiesByType(type) {
    return this.allEntities.filter((entity) => entity.type === type);
  }

  getPersistentEntityStates() {
    return Object.fromEntries(this.allEntities.filter((entity) => entity.state).map((entity) => [entity.id, { ...entity.state }]));
  }

  restoreEntityStates(savedStates = {}) {
    for (const entity of this.allEntities) {
      if (entity.state && savedStates[entity.id]) entity.state = { ...entity.state, ...savedStates[entity.id] };
    }
  }

  resetEntityStates() {
    for (const entity of this.entities) {
      if (entity.initialState) entity.state = { ...entity.initialState };
    }
  }

  draw(context, camera, ship, ai) {
    context.fillStyle = "#09131f";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    for (const room of this.rooms) this.drawRoom(context, camera, room);
    for (const entity of this.allEntities) this.drawEntity(context, camera, entity, ship, ai);
    if (this.id === "ship") {
      context.fillStyle = "rgba(4, 8, 16, 0.32)";
      context.fillRect(Math.round(625 - camera.x), Math.round(70 - camera.y), 270, 180);
    }
  }

  drawRoom(context, camera, room) {
    const x = Math.round(room.bounds.x - camera.x);
    const y = Math.round(room.bounds.y - camera.y);
    context.fillStyle = "#0b1019";
    context.fillRect(x - 4, y - 4, room.bounds.width + 8, room.bounds.height + 8);
    context.fillStyle = room.color;
    context.fillRect(x, y, room.bounds.width, room.bounds.height);
    context.fillStyle = "#42636d";
    context.fillRect(x, y, room.bounds.width, 3);
    context.fillStyle = "#192330";
    for (let gridX = 8; gridX < room.bounds.width; gridX += 24) {
      for (let gridY = 8; gridY < room.bounds.height; gridY += 18) context.fillRect(x + gridX, y + gridY, 1, 1);
    }
    context.fillStyle = "#a8c4bd";
    context.font = "7px monospace";
    context.fillText(room.name, x + 8, y + 13);
  }

  drawEntity(context, camera, entity, ship, ai) {
    if (entity.state?.collected) return;
    if (entity.type === "farmPlot") {
      this.drawFarmPlot(context, camera, entity);
      return;
    }
    context.fillStyle = entity.type === "lockedDoor" && ship?.isUnlocked(entity.areaId, ai?.memory ?? 0) ? "#59c7dd" : entity.color;
    context.fillRect(Math.round(entity.x - camera.x), Math.round(entity.y - camera.y), entity.width, entity.height);
    if (entity.type === "repairStation") {
      context.fillStyle = "#f0a43a";
      context.fillRect(Math.round(entity.x + 12 - camera.x), Math.round(entity.y + 9 - camera.y), 16, 10);
    }
    if (entity.type === "npc") { context.fillStyle = "#1d2938"; context.fillRect(Math.round(entity.x + 2 - camera.x), Math.round(entity.y - camera.y), 6, 3); }
  }

  drawFarmPlot(context, camera, plot) {
    const x = Math.round(plot.x - camera.x);
    const y = Math.round(plot.y - camera.y);
    context.fillStyle = plot.state.prepared ? "#7a5b3a" : plot.color;
    context.fillRect(x, y, plot.width, plot.height);
    context.fillStyle = "#243b32";
    context.fillRect(x + 2, y + 2, plot.width - 4, plot.height - 4);
    if (!plot.state.cropId) return;
    const cropColor = ["#567f42", "#84b84d", "#c8ef66", "#e3ff8e"][plot.state.growthStage] ?? "#567f42";
    const cropHeight = 3 + plot.state.growthStage * 3;
    context.fillStyle = cropColor;
    context.fillRect(x + 22, y + plot.height - cropHeight - 2, 4, cropHeight);
    context.fillRect(x + 17, y + plot.height - cropHeight + 2, 4, 3);
    context.fillRect(x + 25, y + plot.height - cropHeight + 4, 4, 3);
    if (plot.state.watered) {
      context.fillStyle = "#59c7dd";
      context.fillRect(x + plot.width - 5, y + 2, 2, 2);
    }
  }
}