export class AudioManager {
  constructor(settings = {}) { this.settings = { master: 0.7, music: 0.5, effects: 0.7, ...settings }; this.unlocked = false; }
  unlock() { this.unlocked = true; }
  setVolume(category, value) { if (Object.hasOwn(this.settings, category)) this.settings[category] = Math.max(0, Math.min(1, Number(value))); }
  playEffect() { return this.unlocked && this.settings.master * this.settings.effects > 0; }
  setMusicContext() { return this.unlocked && this.settings.master * this.settings.music > 0; }
  toJSON() { return { ...this.settings }; }
}