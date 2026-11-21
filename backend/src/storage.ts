import fs from 'node:fs/promises';
import path from 'node:path';
import type { Game, Review } from './types.js';

const GAMES_PATH = path.join(process.cwd(), 'src', 'data', 'games.json');
const REVIEWS_PATH = path.join(process.cwd(), 'src', 'data', 'reviews.json');

export async function readGames(): Promise<Game[]> {
  try {
    const raw = await fs.readFile(GAMES_PATH, 'utf-8');
    return JSON.parse(raw) as Game[];
  } catch {
    return [];
  }
}

export async function writeGames(games: Game[]): Promise<void> {
  await fs.writeFile(GAMES_PATH, JSON.stringify(games, null, 2), 'utf-8');
}

export async function readReviews(): Promise<Review[]> {
  try {
    const raw = await fs.readFile(REVIEWS_PATH, 'utf-8');
    return JSON.parse(raw) as Review[];
  } catch {
    return [];
  }
}

export async function writeReviews(reviews: Review[]): Promise<void> {
  await fs.writeFile(REVIEWS_PATH, JSON.stringify(reviews, null, 2), 'utf-8');
}