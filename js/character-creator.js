export const PROFESSIONS = [
  { id: "engineer", name: "Engineer", description: "Keeps broken systems alive." },
  { id: "botanist", name: "Botanist", description: "Carries Earth's living memory." },
  { id: "scientist", name: "Scientist", description: "Studies what remains unknown." },
  { id: "explorer", name: "Explorer", description: "Maps the way forward." }
];

export const SUIT_COLORS = [
  { name: "White", value: "#dce8e5" }, { name: "Orange", value: "#f08a3c" },
  { name: "Blue", value: "#4fa8dc" }, { name: "Green", value: "#62bf86" }, { name: "Black", value: "#394150" }
];
export const APPEARANCES = ["Crew Cut", "Long Hair", "Visor"];

export function makeProfile(name, suitColor, appearance, profession) {
  return { name: name.trim(), suitColor, appearance, profession, createdAt: Date.now() };
}