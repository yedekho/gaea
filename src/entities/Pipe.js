import { GAME_CONFIG } from '../constants.js';

export class Pipe {
  constructor(gameContainer) {
    this.x = GAME_CONFIG.WIDTH;
    this.scored = false;
    this.createPipes(gameContainer);
  }

  createPipes(gameContainer) {
    const height = this.generateHeight();
    
    this.topPipe = document.createElement('div');
    this.topPipe.className = 'pipe';
    this.topPipe.style.height = `${height}px`;
    this.topPipe.style.top = '0';
    
    this.bottomPipe = document.createElement('div');
    this.bottomPipe.className = 'pipe';
    this.bottomPipe.style.height = `${GAME_CONFIG.HEIGHT - height - GAME_CONFIG.PIPE_GAP}px`;
    this.bottomPipe.style.bottom = '0';
    
    gameContainer.appendChild(this.topPipe);
    gameContainer.appendChild(this.bottomPipe);
    
    this.updatePosition();
  }

  generateHeight() {
    const maxHeight = GAME_CONFIG.HEIGHT - GAME_CONFIG.PIPE_GAP - GAME_CONFIG.MIN_PIPE_HEIGHT;
    return Math.random() * (maxHeight - GAME_CONFIG.MIN_PIPE_HEIGHT) + GAME_CONFIG.MIN_PIPE_HEIGHT;
  }

  update() {
    this.x -= 2;
    this.updatePosition();
  }

  updatePosition() {
    this.topPipe.style.left = `${this.x}px`;
    this.bottomPipe.style.left = `${this.x}px`;
  }

  getBounds() {
    return {
      top: this.topPipe.getBoundingClientRect(),
      bottom: this.bottomPipe.getBoundingClientRect()
    };
  }

  remove(gameContainer) {
    gameContainer.removeChild(this.topPipe);
    gameContainer.removeChild(this.bottomPipe);
  }
}