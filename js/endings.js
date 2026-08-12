export const ENDINGS = {
  rebuilding: { id: "rebuilding", title: "A New Beginning", text: "The Asteria becomes the first steady light of a rebuilding humanity." },
  companion: { id: "companion", title: "The Companion", text: "You and the restored intelligence choose to protect every signal that answers." },
  explorers: { id: "explorers", title: "Beyond the Window", text: "The ship turns toward the unknown, carrying hope beyond every familiar star." },
  survivors: { id: "survivors", title: "The Final Transmission", text: "Your message reaches the silence. Somewhere, another human voice answers." }
};

export function evaluateEnding({ ship, ai, npcs, discoveries, choices, humanity }) {
  const restored = Object.values(ship.state.repairs).every(Boolean);
  const trustedCrew = Object.values(npcs.state.friendship).filter((value) => value >= 25).length;
  if (!restored || discoveries.discovered.length < 3 || trustedCrew < 1 || !choices.selected) return null;
  if (choices.selected === "search-survivors") return ENDINGS.survivors;
  if (choices.selected === "modify-protocols" && ai.memory >= 60) return ENDINGS.companion;
  if (humanity.status === "Rebuilding") return ENDINGS.rebuilding;
  return ENDINGS.explorers;
}