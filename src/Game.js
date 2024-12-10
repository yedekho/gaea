import { Bird } from './entities/Bird.js';
import { Pipe } from './entities/Pipe.js';
import { ScoreManager } from './utils/score.js';
import { checkCollision } from './utils/collision.js';
import { GAME_CONFIG } from './constants.js';

export class Game {
  constructor() {
    this.initializeElements();
    this.setupGame();
    this.bindEvents();
  }

  initializeElements() {
    this.gameContainer = document.getElementById('game-container');
    this.scoreDisplay = document.getElementById('score-display');
    this.highScoreDisplay = document.getElementById('high-score');
    this.gameOverScreen = document.getElementById('game-over');
    this.finalScoreDisplay = document.getElementById('final-score');
    this.medalDisplay = document.getElementById('medal');
    this.restartBtn = document.getElementById('restart-btn');
  }

  setupGame() {
    this.bird = new Bird(document.getElementById('bird'));
    this.scoreManager = new ScoreManager();
    this.pipes = [];
    this.lastPipeTime = 0;
    this.isGameOver = false;
    
    this.updateHighScoreDisplay();
  }

  bindEvents() {
    document.addEventListener('keydown', (e) => this.handleInput(e));
    document.addEventListener('touchstart', () => this.bird.jump());
    this.restartBtn.addEventListener('click', () => this.restart());
  }

  handleInput(e) {
    if (e.code === 'Space') {
      e.preventDefault();
      this.bird.jump();
    }
  }

  updateHighScoreDisplay() {
    this.highScoreDisplay.textContent = `Best: ${this.scoreManager.highScore}`;
  }

  updatePipes() {
    const now = Date.now();
    if (now - this.lastPipeTime > GAME_CONFIG.PIPE_INTERVAL) {
      this.pipes.push(new Pipe(this.gameContainer));
      this.lastPipeTime = now;
    }

    this.pipes.forEach((pipe, index) => {
      pipe.update();

      if (!pipe.scored && pipe.x < GAME_CONFIG.BIRD_X) {
        pipe.scored = true;
        this.scoreManager.increment();
        this.scoreDisplay.textContent = this.scoreManager.score;
      }

      if (pipe.x < -GAME_CONFIG.PIPE_WIDTH) {
        pipe.remove(this.gameContainer);
        this.pipes.splice(index, 1);
      }
    });
  }

  checkGameOver() {
    const birdRect = this.bird.getBounds();
    
    // Check pipe collisions
    for (const pipe of this.pipes) {
      if (checkCollision(birdRect, pipe.getBounds())) {
        return true;
      }
    }
    
    // Check boundary collisions
    return this.bird.y < 0 || this.bird.y > GAME_CONFIG.HEIGHT - 30;
  }

  gameOver() {
    this.isGameOver = true;
    if (this.scoreManager.updateHighScore()) {
      this.updateHighScoreDisplay();
    }
    
    this.finalScoreDisplay.textContent = `Score: ${this.scoreManager.score}`;
    this.medalDisplay.textContent = this.scoreManager.getMedal();
    this.gameOverScreen.style.display = 'block';
  }

  restart() {
    this.bird.reset();
    this.scoreManager.reset();
    this.scoreDisplay.textContent = '0';
    this.isGameOver = false;
    this.gameOverScreen.style.display = 'none';
    
    this.pipes.forEach(pipe => pipe.remove(this.gameContainer));
    this.pipes = [];
    this.lastPipeTime = 0;
  }

  update() {
    if (!this.isGameOver) {
      this.bird.update();
      this.updatePipes();
      
      if (this.checkGameOver()) {
        this.gameOver();
      }
    }
    requestAnimationFrame(() => this.update());
  }

  start() {
    this.update();
  }
}