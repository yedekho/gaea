import { Application } from '@nativescript/core';
import { Game } from './game-view-model';

Application.run({ create: () => new Game() });