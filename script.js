class FlappyBird {
  constructor() {
    this.bird = document.getElementById('bird');
    this.gameContainer = document.getElementById('game-container');
    this.scoreDisplay = document.getElementById('score-display');
    this.highScoreDisplay = document.getElementById('high-score');
    this.gameOverScreen = document.getElementById('game-over');
    this.finalScoreDisplay = document.getElementById('final-score');
    this.medalDisplay = document.getElementById('medal');
    this.restartBtn = document.getElementById('restart-btn');

    this.gameWidth = 400;
    this.gameHeight = 600;
    this.birdX = 50;
    this.birdY = this.gameHeight / 2;
    this.birdVelocity = 0;
    this.birdGravity = 0.5;
    this.birdLift = -8;
    this.pipes = [];
    this.pipeWidth = 60;
    this.pipeGap = 150;
    this.pipeSpacing = 200;
    this.score = 0;
    this.highScore = parseInt(localStorage.getItem('highScore')) || 0;
    this.isGameOver = false;
    this.lastPipeTime = 0;

    this.init();
  }

  init() {
    this.highScoreDisplay.textContent = `Best: ${this.highScore}`;
    this.restartBtn.addEventListener('click', () => this.restart());
    document.addEventListener('keydown', (e) => this.handleInput(e));
    document.addEventListener('touchstart', () => this.jump());
    this.gameLoop();
  }

  handleInput(e) {
    if (e.code === 'Space') {
      e.preventDefault();
      this.jump();
    }
  }

  jump() {
    if (!this.isGameOver) {
      this.birdVelocity = this.birdLift;
    }
  }

  createPipe() {
    const minHeight = 50;
    const maxHeight = this.gameHeight - this.pipeGap - minHeight;
    const height = Math.random() * (maxHeight - minHeight) + minHeight;
    
    const topPipe = document.createElement('div');
    topPipe.className = 'pipe';
    topPipe.style.height = `${height}px`;
    topPipe.style.top = '0';
    topPipe.style.left = `${this.gameWidth}px`;
    
    const bottomPipe = document.createElement('div');
    bottomPipe.className = 'pipe';
    bottomPipe.style.height = `${this.gameHeight - height - this.pipeGap}px`;
    bottomPipe.style.bottom = '0';
    bottomPipe.style.left = `${this.gameWidth}px`;
    
    this.gameContainer.appendChild(topPipe);
    this.gameContainer.appendChild(bottomPipe);
    
    this.pipes.push({
      x: this.gameWidth,
      topPipe,
      bottomPipe,
      scored: false
    });
  }

  updatePipes() {
    const now = Date.now();
    if (now - this.lastPipeTime > 1500) {
      this.createPipe();
      this.lastPipeTime = now;
    }

    this.pipes.forEach((pipe, index) => {
      pipe.x -= 2;
      pipe.topPipe.style.left = `${pipe.x}px`;
      pipe.bottomPipe.style.left = `${pipe.x}px`;

      if (!pipe.scored && pipe.x < this.birdX) {
        this.score++;
        this.scoreDisplay.textContent = this.score;
        pipe.scored = true;
      }

      if (pipe.x < -this.pipeWidth) {
        this.gameContainer.removeChild(pipe.topPipe);
        this.gameContainer.removeChild(pipe.bottomPipe);
        this.pipes.splice(index, 1);
      }
    });
  }

  checkCollision() {
    const birdRect = this.bird.getBoundingClientRect();
    
    // Check for collisions with pipes
    for (const pipe of this.pipes) {
      const topPipeRect = pipe.topPipe.getBoundingClientRect();
      const bottomPipeRect = pipe.bottomPipe.getBoundingClientRect();
      
      if (this.intersects(birdRect, topPipeRect) || 
          this.intersects(birdRect, bottomPipeRect)) {
        return true;
      }
    }
    
    // Check for collisions with ground or ceiling
    if (this.birdY < 0 || this.birdY > this.gameHeight - 30) {
      return true;
    }
    
    return false;
  }

  intersects(rect1, rect2) {
    return !(rect1.right < rect2.left || 
             rect1.left > rect2.right || 
             rect1.bottom < rect2.top || 
             rect1.top > rect2.bottom);
  }

  getMedal() {
    if (this.score >= 50) return '🏆';
    if (this.score >= 30) return '🥇';
    if (this.score >= 20) return '🥈';
    if (this.score >= 10) return '🥉';
    return '';
  }

  gameOver() {
    this.isGameOver = true;
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('highScore', this.highScore);
      this.highScoreDisplay.textContent = `Best: ${this.highScore}`;
    }
    
    this.finalScoreDisplay.textContent = `Score: ${this.score}`;
    this.medalDisplay.textContent = this.getMedal();
    this.gameOverScreen.style.display = 'block';
  }

  restart() {
    this.birdY = this.gameHeight / 2;
    this.birdVelocity = 0;
    this.score = 0;
    this.scoreDisplay.textContent = '0';
    this.isGameOver = false;
    this.gameOverScreen.style.display = 'none';
    
    // Remove all pipes
    this.pipes.forEach(pipe => {
      this.gameContainer.removeChild(pipe.topPipe);
      this.gameContainer.removeChild(pipe.bottomPipe);
    });
    this.pipes = [];
    this.lastPipeTime = 0;
  }

  update() {
    if (!this.isGameOver) {
      // Update bird physics
      this.birdVelocity += this.birdGravity;
      this.birdY += this.birdVelocity;
      
      // Rotate bird based on velocity
      const rotation = Math.min(Math.max(this.birdVelocity * 4, -45), 45);
      this.bird.style.transform = `translateY(${this.birdY}px) rotate(${rotation}deg)`;
      
      this.updatePipes();
      
      if (this.checkCollision()) {
        this.gameOver();
      }
    }
  }

  gameLoop() {
    this.update();
    requestAnimationFrame(() => this.gameLoop());
  }
}

// Start the game
new FlappyBird();