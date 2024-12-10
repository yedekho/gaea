import { GAME_CONFIG } from '../constants.js';

export class Bird {
  constructor(element) {
    this.element = element;
    this.y = GAME_CONFIG.HEIGHT / 2;
    this.velocity = 0;
  }

  jump() {
    this.velocity = GAME_CONFIG.BIRD_LIFT;
  }

  update() {
    this.velocity += GAME_CONFIG.BIRD_GRAVITY;
    this.y += this.velocity;
    
    const rotation = Math.min(Math.max(this.velocity * 4, -45), 45);
    this.element.style.transform = `translateY(${this.y}px) rotate(${rotation}deg)`;
  }

  getBounds() {
    return this.element.getBoundingClientRect();
  }

  reset() {
    this.y = GAME_CONFIG.HEIGHT / 2;
    this.velocity = 0;
    this.update();
  }
}