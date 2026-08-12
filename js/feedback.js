export class Feedback {
  constructor() { this.messages = []; this.shake = 0; }
  push(text, x = null, y = null) { this.messages.push({ text, x, y, age: 0 }); if (this.messages.length > 4) this.messages.shift(); }
  hit() { this.shake = 0.18; }
  update(deltaTime) { this.shake = Math.max(0, this.shake - deltaTime); this.messages.forEach((message) => { message.age += deltaTime; }); this.messages = this.messages.filter((message) => message.age < 1.6); }
}