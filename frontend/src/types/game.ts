export type RatingStatus =
  | 'Overwhelmingly Positive'
  | 'Positive'
  | 'Mixed'
  | 'Negative'
  | 'No Reviews';

export interface Game {
  id: string;
  title: string;
  genre: string;
  price: number;
  discount: number;
  developer: string;
  image_url: string;
  description: string;
  review_count: number;
  positive_percentage: number;
  rating_status: RatingStatus;
}

export interface CreateGamePayload {
  title: string;
  genre: string;
  price: number;
  discount: number;
  developer: string;
  image_url: string;
  description: string;
}

export interface Review {
  id: string;
  game_id: string;
  author: string;
  is_recommended: boolean;
  hours_played: number;
  text: string;
  created_at: string;
}

export interface CreateReviewPayload {
  author: string;
  is_recommended: boolean;
  hours_played: number;
  text: string;
}