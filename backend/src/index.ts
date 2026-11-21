import express from 'express';
import cors from 'cors';
import crypto from 'node:crypto';
import { readGames, writeGames, readReviews, writeReviews } from './storage.js';
import type { Game, GameWithStats, RatingStatus, Review } from './types.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

function calculateRatingStatus(count: number, positivePct: number): RatingStatus {
  if (count === 0) {
    return 'No Reviews';
  }
  if (positivePct >= 90) {
    return 'Overwhelmingly Positive';
  }
  if (positivePct >= 70) {
    return 'Positive';
  }
  if (positivePct >= 40) {
    return 'Mixed';
  }
  return 'Negative';
}

function attachStats(game: Game, allReviews: Review[]): GameWithStats {
  const gameReviews = allReviews.filter((r) => r.game_id === game.id);
  const reviewCount = gameReviews.length;
  const positiveCount = gameReviews.filter((r) => r.is_recommended).length;
  const positivePercentage =
    reviewCount > 0 ? Math.round((positiveCount / reviewCount) * 100) : 0;

  return {
    ...game,
    review_count: reviewCount,
    positive_percentage: positivePercentage,
    rating_status: calculateRatingStatus(reviewCount, positivePercentage),
  };
}

app.get('/api/games', async (req, res) => {
  try {
    const games = await readGames();
    const reviews = await readReviews();
    const genreQuery =
      typeof req.query.genre === 'string' ? req.query.genre.trim() : '';

    const filtered =
      genreQuery && genreQuery.toLowerCase() !== 'all'
        ? games.filter((g) => g.genre.toLowerCase() === genreQuery.toLowerCase())
        : games;

    const result = filtered.map((game) => attachStats(game, reviews));
    res.status(200).json(result);
  } catch {
    res.status(500).json({ message: 'Failed to load games' });
  }
});

app.get('/api/games/:id', async (req, res) => {
  try {
    const games = await readGames();
    const game = games.find((g) => g.id === req.params.id);

    if (!game) {
      res.status(404).json({ message: 'Game not found' });
      return;
    }

    const reviews = await readReviews();
    res.status(200).json(attachStats(game, reviews));
  } catch {
    res.status(500).json({ message: 'Failed to load game' });
  }
});

app.post('/api/games', async (req, res) => {
  try {
    const { title, genre, price, discount, developer, image_url, description } =
      req.body;

    if (
      typeof title !== 'string' ||
      !title.trim() ||
      typeof genre !== 'string' ||
      !genre.trim() ||
      typeof price !== 'number' ||
      Number.isNaN(price) ||
      price <= 0
    ) {
      res.status(400).json({
        message: 'Fields title, genre, and price (> 0) are required',
      });
      return;
    }

    const parsedDiscount =
      typeof discount === 'number' && !Number.isNaN(discount) ? discount : 0;

    if (parsedDiscount < 0 || parsedDiscount > 90) {
      res.status(400).json({ message: 'Discount must be between 0 and 90' });
      return;
    }

    const newGame: Game = {
      id: crypto.randomUUID(),
      title: title.trim(),
      genre: genre.trim(),
      price,
      discount: parsedDiscount,
      developer:
        typeof developer === 'string' && developer.trim()
          ? developer.trim()
          : 'Indie Studio',
      image_url:
        typeof image_url === 'string' && image_url.trim()
          ? image_url.trim()
          : 'https://placehold.co/600x340/2a2421/d4a373?text=Indie+Game',
      description:
        typeof description === 'string' && description.trim()
          ? description.trim()
          : 'No description provided.',
    };

    const games = await readGames();
    games.push(newGame);
    await writeGames(games);

    res.status(201).json(attachStats(newGame, []));
  } catch {
    res.status(500).json({ message: 'Failed to create game' });
  }
});

app.patch('/api/games/:id/discount', async (req, res) => {
  try {
    const { discount } = req.body;

    if (
      typeof discount !== 'number' ||
      Number.isNaN(discount) ||
      discount < 0 ||
      discount > 90
    ) {
      res.status(400).json({ message: 'Discount must be a number from 0 to 90' });
      return;
    }

    const games = await readGames();
    const index = games.findIndex((g) => g.id === req.params.id);

    if (index === -1) {
      res.status(404).json({ message: 'Game not found' });
      return;
    }

    games[index] = {
      ...games[index],
      discount,
    };

    await writeGames(games);
    const reviews = await readReviews();
    res.status(200).json(attachStats(games[index], reviews));
  } catch {
    res.status(500).json({ message: 'Failed to update discount' });
  }
});

app.delete('/api/games/:id', async (req, res) => {
  try {
    const games = await readGames();
    const exists = games.some((g) => g.id === req.params.id);

    if (!exists) {
      res.status(404).json({ message: 'Game not found' });
      return;
    }

    const updatedGames = games.filter((g) => g.id !== req.params.id);
    await writeGames(updatedGames);

    const reviews = await readReviews();
    const updatedReviews = reviews.filter((r) => r.game_id !== req.params.id);
    await writeReviews(updatedReviews);

    res.status(204).send();
  } catch {
    res.status(500).json({ message: 'Failed to delete game' });
  }
});

app.get('/api/games/:id/reviews', async (req, res) => {
  try {
    const games = await readGames();
    const exists = games.some((g) => g.id === req.params.id);

    if (!exists) {
      res.status(404).json({ message: 'Game not found' });
      return;
    }

    const reviews = await readReviews();
    const gameReviews = reviews
      .filter((r) => r.game_id === req.params.id)
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

    res.status(200).json(gameReviews);
  } catch {
    res.status(500).json({ message: 'Failed to load reviews' });
  }
});

app.post('/api/games/:id/reviews', async (req, res) => {
  try {
    const games = await readGames();
    const exists = games.some((g) => g.id === req.params.id);

    if (!exists) {
      res.status(404).json({ message: 'Game not found' });
      return;
    }

    const { author, is_recommended, hours_played, text } = req.body;

    if (
      typeof author !== 'string' ||
      !author.trim() ||
      typeof text !== 'string' ||
      !text.trim() ||
      typeof is_recommended !== 'boolean' ||
      typeof hours_played !== 'number' ||
      Number.isNaN(hours_played) ||
      hours_played < 0
    ) {
      res.status(400).json({
        message: 'Valid author, text, is_recommended, and hours_played are required',
      });
      return;
    }

    const newReview: Review = {
      id: crypto.randomUUID(),
      game_id: req.params.id,
      author: author.trim(),
      is_recommended,
      hours_played,
      text: text.trim(),
      created_at: new Date().toISOString(),
    };

    const reviews = await readReviews();
    reviews.push(newReview);
    await writeReviews(reviews);

    res.status(201).json(newReview);
  } catch {
    res.status(500).json({ message: 'Failed to create review' });
  }
});

app.delete('/api/reviews/:review_id', async (req, res) => {
  try {
    const reviews = await readReviews();
    const exists = reviews.some((r) => r.id === req.params.review_id);

    if (!exists) {
      res.status(404).json({ message: 'Review not found' });
      return;
    }

    const updatedReviews = reviews.filter((r) => r.id !== req.params.review_id);
    await writeReviews(updatedReviews);

    res.status(204).send();
  } catch {
    res.status(500).json({ message: 'Failed to delete review' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});