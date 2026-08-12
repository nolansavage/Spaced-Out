import { Camera } from "./camera.js";
import { applyPixelScale, INTERNAL_HEIGHT, INTERNAL_WIDTH } from "./display.js";
import { Game } from "./game.js";
import { loadSaveData, saveGame } from "./save.js";
import { UI } from "./ui.js";
import { World } from "./world.js";

const canvas = document.querySelector("#game-canvas");
const context = canvas.getContext("2d");
context.imageSmoothingEnabled = false;
canvas.width = INTERNAL_WIDTH;
canvas.height = INTERNAL_HEIGHT;

const world = new World();
const camera = new Camera(canvas.width, canvas.height);
const ui = new UI();
const input = {};
const game = new Game({
  world,
  camera,
  ui,
  input,
  onSaveRequested: (profile, gameState) => saveGame(profile, gameState)
});
let saveResult = loadSaveData();
let previousTime = 0;

function returnToTitle() { game.showTitle(Boolean(loadSaveData().data)); }

ui.bind({
  onNewJourney: () => game.showCreator(),
  onContinue: () => { saveResult = loadSaveData(); if (saveResult.data) game.start(saveResult.data.character, saveResult.data.gameState); },
  onProfileCreated: (newProfile) => {
    game.start(newProfile);
    const result = saveGame(newProfile, game.getSaveState());
    if (!result.ok) console.warn("Character profile could not be saved.", result.error);
  },
  onCreatorBack: returnToTitle,
  onReturnToTitle: returnToTitle,
  onResume: () => game.resume(),
  onToggleInventory: () => game.toggleInventory(),
  onHotbarSelected: (index) => game.selectHotbar(index),
  onConfirmSleep: () => game.endDay(),
  onCancelSleep: () => game.cancelSleep()
  ,onCraftRecipe: (recipeId) => game.craftRecipe(recipeId)
  ,onCloseCrafting: () => game.closeCrafting(),
  onDestinationSelected: (planetId) => game.selectDestination(planetId),
  onExpeditionLaunch: (planetId) => game.launchExpedition(planetId),
  onCloseNavigation: () => game.closeNavigation()
  ,onDialogueChoice: (npcId, option) => game.chooseDialogue(npcId, option)
  ,onCloseDialogue: () => game.closeDialogue()
  ,onFutureChoice: (choiceId) => game.chooseFuture(choiceId)
  ,onOpenSettings: () => ui.showSettings(game.settings ?? { master: 0.7, music: 0.5, effects: 0.7 })
  ,onCloseSettings: () => ui.showSettings(null)
  ,onSettingChanged: (name, value) => { if (game.settings) game.settings[name] = value; }
});
game.showTitle(Boolean(saveResult.data));

const shell = document.querySelector(".game-shell");
function resizeDisplay() { applyPixelScale(shell, canvas); }
resizeDisplay();
window.addEventListener("resize", resizeDisplay);

window.addEventListener("keydown", (event) => {
  if (event.code === "Escape" && (game.acceptsMovementInput() || game.state === "paused")) {
    event.preventDefault();
    game.togglePause();
    return;
  }
  if (event.code === "Tab" && (game.acceptsMovementInput() || game.state === "inventory")) {
    event.preventDefault();
    game.toggleInventory();
    return;
  }
  if (event.code === "KeyE" && game.acceptsMovementInput()) {
    event.preventDefault();
    game.interact();
    return;
  }
  if (event.code === "KeyP" && game.acceptsMovementInput()) {
    event.preventDefault();
    game.togglePlacement();
    return;
  }
  if (event.code.startsWith("Digit") && game.acceptsMovementInput()) {
    const index = Number(event.code.slice(5)) - 1;
    if (index >= 0 && index < 8) {
      event.preventDefault();
      game.selectHotbar(index);
      return;
    }
  }
  if (!game.acceptsMovementInput()) return;
  if (["KeyW", "KeyA", "KeyS", "KeyD"].includes(event.code)) event.preventDefault();
  input[event.code] = true;
});
window.addEventListener("keyup", (event) => { delete input[event.code]; });
window.addEventListener("blur", () => game.clearInput());
canvas.addEventListener("click", (event) => {
  const bounds = canvas.getBoundingClientRect();
  const targetX = (event.clientX - bounds.left) * canvas.width / bounds.width + camera.x;
  const targetY = (event.clientY - bounds.top) * canvas.height / bounds.height + camera.y;
  if (game.placementMode) game.placeAt(targetX, targetY);
  else game.fireAt(targetX, targetY);
});
canvas.addEventListener("contextmenu", (event) => {
  if (!game.placementMode) return;
  event.preventDefault();
  const bounds = canvas.getBoundingClientRect();
  game.removeAt((event.clientX - bounds.left) * canvas.width / bounds.width + camera.x, (event.clientY - bounds.top) * canvas.height / bounds.height + camera.y);
});

function frame(timestamp) {
  const deltaTime = Math.min((timestamp - previousTime) / 1000 || 0, 0.05);
  previousTime = timestamp;
  game.update(deltaTime);
  game.draw(context);
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);