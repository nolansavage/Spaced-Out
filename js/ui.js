import { APPEARANCES, PROFESSIONS, SUIT_COLORS, makeProfile } from "./character-creator.js";
import { getItemDefinition } from "./items.js";
import { RECIPES } from "./crafting.js";

export class UI {
  constructor() {
    this.title = document.querySelector("#title-screen");
    this.creator = document.querySelector("#creator-screen");
    this.hud = document.querySelector("#hud");
    this.hotbar = document.querySelector("#hotbar");
    this.inventoryScreen = document.querySelector("#inventory-screen");
    this.inventoryContent = document.querySelector("#inventory-content");
    this.craftingScreen = document.querySelector("#crafting-screen");
    this.craftingContent = document.querySelector("#crafting-content");
    this.sleepScreen = document.querySelector("#sleep-screen");
    this.message = document.querySelector("#game-message");
    this.shipStatus = document.querySelector("#ship-status");
    this.pause = document.querySelector("#pause-screen");
    this.form = document.querySelector("#creator-form");
    this.nameInput = document.querySelector("#player-name");
    this.error = document.querySelector("#creator-error");
    this.selectedSuit = SUIT_COLORS[0].value;
    this.selectedAppearance = APPEARANCES[0];
    this.selectedProfession = PROFESSIONS[0].id;
    this.renderChoices();
  }

  renderChoices() {
    this.renderButtons("#suit-options", SUIT_COLORS, (choice) => choice.value, (choice) => choice.name, (value) => { this.selectedSuit = value; });
    this.renderButtons("#appearance-options", APPEARANCES, (choice) => choice, (choice) => choice, (value) => { this.selectedAppearance = value; });
    const container = document.querySelector("#profession-options");
    container.innerHTML = "";
    for (const profession of PROFESSIONS) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "profession-option";
      button.dataset.value = profession.id;
      button.innerHTML = `${profession.name}<span>${profession.description}</span>`;
      button.addEventListener("click", () => { this.selectedProfession = profession.id; this.renderChoices(); });
      if (profession.id === this.selectedProfession) button.classList.add("is-selected");
      container.append(button);
    }
  }

  renderButtons(selector, choices, valueOf, labelOf, select) {
    const container = document.querySelector(selector);
    container.innerHTML = "";
    for (const choice of choices) {
      const value = valueOf(choice);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "choice-button";
      button.textContent = labelOf(choice);
      button.addEventListener("click", () => { select(value); this.renderChoices(); });
      if (value === this.selectedSuit || value === this.selectedAppearance) button.classList.add("is-selected");
      container.append(button);
    }
  }

  bind({ onNewJourney, onContinue, onProfileCreated, onCreatorBack, onReturnToTitle, onResume, onToggleInventory, onHotbarSelected, onConfirmSleep, onCancelSleep, onCraftRecipe, onCloseCrafting, onDestinationSelected, onExpeditionLaunch, onCloseNavigation, onDialogueChoice, onCloseDialogue, onFutureChoice, onOpenSettings, onCloseSettings, onSettingChanged }) {
    this.onHotbarSelected = onHotbarSelected;
    document.querySelector("#new-journey-button").addEventListener("click", onNewJourney);
    document.querySelector("#continue-button").addEventListener("click", onContinue);
    document.querySelector("#creator-back-button").addEventListener("click", onCreatorBack);
    document.querySelector("#return-title-button").addEventListener("click", onReturnToTitle);
    document.querySelector("#resume-button").addEventListener("click", onResume);
    document.querySelector("#inventory-button").addEventListener("click", onToggleInventory);
    document.querySelector("#close-inventory-button").addEventListener("click", onToggleInventory);
    document.querySelector("#confirm-sleep-button").addEventListener("click", onConfirmSleep);
    document.querySelector("#cancel-sleep-button").addEventListener("click", onCancelSleep);
    document.querySelector("#close-crafting-button").addEventListener("click", onCloseCrafting);
    this.onCraftRecipe = onCraftRecipe;
    this.onDestinationSelected = onDestinationSelected;
    this.onExpeditionLaunch = onExpeditionLaunch;
    document.querySelector("#close-navigation-button").addEventListener("click", onCloseNavigation);
    document.querySelector("#close-dialogue-button").addEventListener("click", onCloseDialogue);
    this.onDialogueChoice = onDialogueChoice;
    this.onFutureChoice = onFutureChoice;
    document.querySelector("#settings-button").addEventListener("click", onOpenSettings);
    document.querySelector("#close-settings-button").addEventListener("click", onCloseSettings);
    ["master", "music", "effects"].forEach((name) => document.querySelector(`#${name}-volume`).addEventListener("input", (event) => onSettingChanged(name, Number(event.target.value))));
    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
      const profile = makeProfile(this.nameInput.value, this.selectedSuit, this.selectedAppearance, this.selectedProfession);
      if (!profile.name) { this.error.textContent = "A survivor name is required."; return; }
      this.error.textContent = "";
      onProfileCreated(profile);
    });
  }

  showTitle(canContinue = false) {
    this.title.classList.remove("is-hidden");
    this.creator.classList.add("is-hidden");
    this.hud.classList.add("is-hidden");
    this.hotbar.classList.add("is-hidden");
    this.inventoryScreen.classList.add("is-hidden");
    this.craftingScreen.classList.add("is-hidden");
    document.querySelector("#navigation-screen").classList.add("is-hidden");
    document.querySelector("#dialogue-screen").classList.add("is-hidden");
    this.sleepScreen.classList.add("is-hidden");
    this.pause.classList.add("is-hidden");
    this.message.classList.add("is-hidden");
    this.shipStatus.classList.add("is-hidden");
    document.querySelector("#continue-button").disabled = !canContinue;
  }

  showCreator() { this.title.classList.add("is-hidden"); this.creator.classList.remove("is-hidden"); this.nameInput.focus(); }
  showGame(profile) {
    this.title.classList.add("is-hidden"); this.creator.classList.add("is-hidden"); this.hud.classList.remove("is-hidden"); this.hotbar.classList.remove("is-hidden"); this.shipStatus.classList.remove("is-hidden");
    this.inventoryScreen.classList.add("is-hidden"); this.sleepScreen.classList.add("is-hidden");
    const profession = PROFESSIONS.find((entry) => entry.id === profile.profession);
    document.querySelector("#hud-profile").textContent = `${profile.name} | ${profession.name.toUpperCase()}`;
  }
  showPause(isPaused) { this.pause.classList.toggle("is-hidden", !isPaused); }

  updateHud(profile, time, stats) {
    if (!profile || !time || !stats) return;
    const profession = PROFESSIONS.find((entry) => entry.id === profile.profession);
    document.querySelector("#hud-profile").textContent = `${profile.name} | ${profession.name.toUpperCase()}`;
    document.querySelector("#hud-stats").innerHTML = `<p>DAY ${time.state.day}</p><p>${time.formattedTime} <span>${time.phase}</span></p><p>HP ${stats.health}/${stats.maxHealth}</p><p>ENERGY ${stats.energy}/${stats.maxEnergy}</p><p>CREDITS ${stats.credits}</p>`;
  }

  renderHotbar(hotbar, selectedIndex, inventory) {
    this.hotbar.innerHTML = "";
    hotbar.forEach((itemId, index) => {
      const definition = getItemDefinition(itemId);
      const quantity = itemId ? inventory.items.find((item) => item.itemId === itemId)?.quantity : null;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "hotbar-slot";
      button.title = `Slot ${index + 1}${definition ? `: ${definition.name}` : ""}`;
      if (index === selectedIndex) button.classList.add("is-selected");
      button.innerHTML = `<span>${index + 1}</span><strong>${definition?.name ?? "Empty"}</strong>${quantity && definition.stackable ? `<em>${quantity}</em>` : ""}`;
      button.addEventListener("click", () => this.onHotbarSelected?.(index));
      this.hotbar.append(button);
    });
  }

  showInventory(inventory) {
    this.inventoryScreen.classList.toggle("is-hidden", !inventory);
    if (inventory) this.renderInventory(inventory);
  }

  showCrafting(isVisible) {
    this.craftingScreen.classList.toggle("is-hidden", !isVisible);
    if (!isVisible) return;
    this.craftingContent.innerHTML = "";
    for (const recipe of Object.values(RECIPES)) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "profession-option";
      button.innerHTML = `${recipe.name}<span>${Object.entries(recipe.materials).map(([id, quantity]) => `${getItemDefinition(id).name} x${quantity}`).join(" | ")}</span>`;
      button.addEventListener("click", () => this.onCraftRecipe?.(recipe.id));
      this.craftingContent.append(button);
    }
  }

  renderInventory(inventory) {
    this.inventoryContent.innerHTML = "";
    for (const group of inventory.getCategories()) {
      const section = document.createElement("section");
      section.className = "inventory-category";
      const heading = document.createElement("h3");
      heading.textContent = group.category;
      section.append(heading);
      const list = document.createElement("div");
      list.className = "inventory-list";
      if (!group.items.length) list.textContent = "Empty";
      for (const item of group.items) {
        const definition = getItemDefinition(item.itemId);
        const entry = document.createElement("p");
        entry.textContent = definition.stackable ? `${definition.name} x${item.quantity}` : definition.name;
        list.append(entry);
      }
      section.append(list);
      this.inventoryContent.append(section);
    }
  }

  showSleepConfirm(isVisible) { this.sleepScreen.classList.toggle("is-hidden", !isVisible); }

  showMessage(text) {
    this.message.textContent = text;
    this.message.classList.remove("is-hidden");
  }

  updateShipStatus(statuses = []) {
    this.shipStatus.innerHTML = `<p>SHIP STATUS</p>${statuses.map((status) => `<div><span>${status.name}</span><b>${status.value === null ? "LOCKED" : `${status.value}%`}</b></div>`).join("")}`;
  }

  showLog(log) { this.showMessage(`LOG: ${log.title} - ${log.text}`); }

  showNavigation(planets, selectedPlanet = null) {
    const screen = document.querySelector("#navigation-screen");
    if (!planets) { screen.classList.add("is-hidden"); return; }
    screen.classList.remove("is-hidden");
    const content = document.querySelector("#navigation-content");
    content.innerHTML = "";
    for (const planet of planets) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "profession-option";
      button.innerHTML = `${planet.name}<span>${planet.environment} | ${planet.difficulty} | ${planet.risk} risk</span>`;
      button.addEventListener("click", () => this.onDestinationSelected?.(planet.id));
      content.append(button);
    }
    if (selectedPlanet) {
      const analysis = document.createElement("p"); analysis.textContent = selectedPlanet.analysis; content.append(analysis);
      const launch = document.createElement("button"); launch.type = "button"; launch.textContent = `Begin Expedition: ${selectedPlanet.name}`;
      launch.addEventListener("click", () => this.onExpeditionLaunch?.(selectedPlanet.id)); content.append(launch);
    }
  }

  showDialogue(npc, dialogue) {
    const screen = document.querySelector("#dialogue-screen");
    if (!npc) { screen.classList.add("is-hidden"); return; }
    screen.classList.remove("is-hidden");
    document.querySelector("#dialogue-role").textContent = npc.role;
    document.querySelector("#dialogue-title").textContent = npc.name;
    document.querySelector("#dialogue-text").textContent = dialogue.greeting;
    const options = document.querySelector("#dialogue-options"); options.innerHTML = "";
    for (const option of dialogue.options) { const button = document.createElement("button"); button.type = "button"; button.textContent = option.text; button.addEventListener("click", () => this.onDialogueChoice?.(npc.id, option)); options.append(button); }
  }

  showChoices(choices) { const screen=document.querySelector("#choice-screen"); if (!choices) { screen.classList.add("is-hidden"); return; } screen.classList.remove("is-hidden"); const container=document.querySelector("#choice-options"); container.innerHTML=""; for (const choice of choices) { const button=document.createElement("button"); button.type="button"; button.className="profession-option"; button.innerHTML=`${choice.title}<span>${choice.description}</span>`; button.addEventListener("click",()=>this.onFutureChoice?.(choice.id)); container.append(button); } }
  showSettings(settings) { const screen=document.querySelector("#settings-screen"); screen.classList.toggle("is-hidden", !settings); if (settings) ["master", "music", "effects"].forEach((name) => { document.querySelector(`#${name}-volume`).value = settings[name]; }); }
}