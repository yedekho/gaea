import { Observable } from '@nativescript/core';
import { GAME_CONFIG } from './constants';
import { ScoreManager } from './utils/score';

export class Game extends Observable {
    constructor() {
        super();

        this.birdX = GAME_CONFIG.BIRD_X;
        this.birdY = GAME_CONFIG.HEIGHT / 2;
        this.birdVelocity = 0;
        this.pipes = [];
        this.isGameOver = false;
        this.scoreManager = new ScoreManager();
        
        this.setupGame();
        this.startGameLoop();
    }

    setupGame() {
        this.set('score', 0);
        this.set('highScore', this.scoreManager.highScore);
        this.set('medal', '');
        this.set('isGameOver', false);
        this.lastPipeTime = Date.now();
    }

    jump() {
        if (!this.isGameOver) {
            this.birdVelocity = GAME_CONFIG.BIRD_LIFT;
        }
    }

    createPipe() {
        const height = this.generatePipeHeight();
        const pipe = {
            x: GAME_CONFIG.WIDTH,
            topHeight: height,
            bottomHeight: GAME_CONFIG.HEIGHT - height - GAME_CONFIG.PIPE_GAP,
            scored: false
        };
        this.pipes.push(pipe);
    }

    generatePipeHeight() {
        return Math.random() * (GAME_CONFIG.HEIGHT - GAME_CONFIG.PIPE_GAP - 2 * GAME_CONFIG.MIN_PIPE_HEIGHT) + GAME_CONFIG.MIN_PIPE_HEIGHT;
    }

    updatePipes() {
        const now = Date.now();
        if (now - this.lastPipeTime > GAME_CONFIG.PIPE_INTERVAL) {
            this.createPipe();
            this.lastPipeTime = now;
        }

        for (let i = this.pipes.length - 1; i >= 0; i--) {
            const pipe = this.pipes[i];
            pipe.x -= 2;

            if (!pipe.scored && pipe.x < GAME_CONFIG.BIRD_X) {
                pipe.scored = true;
                this.scoreManager.increment();
                this.set('score', this.scoreManager.score);
            }

            if (pipe.x < -GAME_CONFIG.PIPE_WIDTH) {
                this.pipes.splice(i, 1);
            }
        }
    }

    checkCollision() {
        const birdRight = this.birdX + 40;
        const birdBottom = this.birdY + 30;

        // Check boundary collisions
        if (this.birdY < 0 || birdBottom > GAME_CONFIG.HEIGHT) {
            return true;
        }

        // Check pipe collisions
        for (const pipe of this.pipes) {
            if (birdRight > pipe.x && this.birdX < pipe.x + GAME_CONFIG.PIPE_WIDTH) {
                if (this.birdY < pipe.topHeight || birdBottom > pipe.topHeight + GAME_CONFIG.PIPE_GAP) {
                    return true;
                }
            }
        }

        return false;
    }

    gameOver() {
        this.set('isGameOver', true);
        if (this.scoreManager.updateHighScore()) {
            this.set('highScore', this.scoreManager.highScore);
        }
        this.set('medal', this.scoreManager.getMedal());
    }

    restart() {
        this.birdY = GAME_CONFIG.HEIGHT / 2;
        this.birdVelocity = 0;
        this.pipes = [];
        this.scoreManager.reset();
        this.setupGame();
    }

    update() {
        if (!this.isGameOver) {
            // Update bird physics
            this.birdVelocity += GAME_CONFIG.BIRD_GRAVITY;
            this.birdY += this.birdVelocity;
            this.set('birdY', this.birdY);

            this.updatePipes();

            if (this.checkCollision()) {
                this.gameOver();
            }
        }
    }

    startGameLoop() {
        setInterval(() => {
            this.update();
        }, 1000 / 60); // 60 FPS
    }
}