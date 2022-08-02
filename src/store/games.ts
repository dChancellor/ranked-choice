import type { Game } from 'src/types';
import { writable, type Writable } from 'svelte/store';

export const sortedGameStore: Writable<Game[]> = writable();
