import { ApplicationSettings } from '@nativescript/core';
import { MEDALS } from '../constants';

export class ScoreManager {
    constructor() {
        this.score = 0;
        this.highScore = parseInt(ApplicationSettings.getNumber('highScore', 0));
    }

    increment() {
        this.score++;
    }

    getMedal() {
        if (this.score >= MEDALS.TROPHY.score) return MEDALS.TROPHY.emoji;
        if (this.score >= MEDALS.GOLD.score) return MEDALS.GOLD.emoji;
        if (this.score >= MEDALS.SILVER.score) return MEDALS.SILVER.emoji;
        if (this.score >= MEDALS.BRONZE.score) return MEDALS.BRONZE.emoji;
        return '';
    }

    updateHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            ApplicationSettings.setNumber('highScore', this.highScore);
            return true;
        }
        return false;
    }

    reset() {
        this.score = 0;
    }
}