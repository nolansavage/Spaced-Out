export const STARTING_DAY = 1;
export const STARTING_MINUTES = 8 * 60;
export const MINUTES_PER_REAL_SECOND = 6;
const MINUTES_PER_DAY = 24 * 60;

export function createTimeState(savedState = {}) {
  return {
    day: Number.isInteger(savedState.day) && savedState.day > 0 ? savedState.day : STARTING_DAY,
    minutes: Number.isFinite(savedState.minutes) && savedState.minutes >= 0 && savedState.minutes < MINUTES_PER_DAY
      ? Math.floor(savedState.minutes)
      : STARTING_MINUTES
  };
}

export class GameTime {
  constructor(savedState, minutesPerRealSecond = MINUTES_PER_REAL_SECOND) {
    this.state = createTimeState(savedState);
    this.minutesPerRealSecond = minutesPerRealSecond;
    this.minuteRemainder = 0;
  }

  update(deltaTime) {
    this.minuteRemainder += deltaTime * this.minutesPerRealSecond;
    const elapsedMinutes = Math.floor(this.minuteRemainder);
    if (!elapsedMinutes) return 0;
    this.minuteRemainder -= elapsedMinutes;
    this.advance(elapsedMinutes);
    return elapsedMinutes;
  }

  advance(minutes) {
    this.state.minutes += minutes;
    while (this.state.minutes >= MINUTES_PER_DAY) {
      this.state.minutes -= MINUTES_PER_DAY;
      this.state.day += 1;
    }
  }

  beginNextDay() {
    this.state.day += 1;
    this.state.minutes = STARTING_MINUTES;
    this.minuteRemainder = 0;
  }

  get phase() {
    const hour = Math.floor(this.state.minutes / 60);
    if (hour < 12) return "Morning";
    if (hour < 17) return "Afternoon";
    if (hour < 21) return "Evening";
    return "Night";
  }

  get formattedTime() {
    const hour24 = Math.floor(this.state.minutes / 60);
    const minute = this.state.minutes % 60;
    const suffix = hour24 >= 12 ? "PM" : "AM";
    const hour12 = hour24 % 12 || 12;
    return `${hour12}:${String(minute).padStart(2, "0")} ${suffix}`;
  }

  getEventContext() {
    return { day: this.state.day, minutes: this.state.minutes, phase: this.phase, season: null, storyProgression: null };
  }

  toJSON() {
    return { ...this.state };
  }
}