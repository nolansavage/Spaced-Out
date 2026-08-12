export const DIALOGUE = {
  aria: { greeting: "The engineering diagnostics say I have been here before. They are wrong.", options: [{ id: "aria-listen", text: "I believe you.", friendship: 5 }, { id: "aria-press", text: "What do you remember?", friendship: 2, lockedAt: 25, response: "A corridor alarm. Then nothing." }] },
  milo: { greeting: "These plants are growing toward a star they have never seen.", options: [{ id: "milo-help", text: "Can I help with the samples?", friendship: 5 }, { id: "milo-mission", text: "What was the original mission?", friendship: 2, lockedAt: 25, response: "I know the designation. I do not know why." }] },
  nova: { greeting: "The signal outside keeps moving whenever I chart it.", options: [{ id: "nova-signal", text: "Show me the signal data.", friendship: 5 }, { id: "nova-crew", text: "Did anyone else hear it?", friendship: 2, lockedAt: 25, response: "The records say no. The records are incomplete." }] }
};

export function getDialogue(npcId, friendship) { const dialogue = DIALOGUE[npcId]; return dialogue ? { ...dialogue, options: dialogue.options.filter((option) => !option.lockedAt || friendship >= option.lockedAt) } : null; }