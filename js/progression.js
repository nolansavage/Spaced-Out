export function evaluateProgression({ ship, ai, discoveries, npcs, memories, choices }) {
  const allBaseRepairs = ["emergency-power", "hydroponics-system", "life-support"].every((id) => ship.state.repairs[id]);
  const relationshipCount = Object.values(npcs.state.friendship).filter((value) => value >= 25).length;
  const discoveryCount = discoveries.discovered.length;
  const stage = ai.memory >= 60 ? "emotional" : ai.memory >= 40 ? "protective" : ai.memory >= 20 ? "curious" : "analytical";
  return { allBaseRepairs, relationshipCount, discoveryCount, stage, canRestoreAdvanced: allBaseRepairs && discoveryCount >= 1, canChooseFuture: memories.discovered.length >= 3 && relationshipCount >= 1 && !choices.selected };
}