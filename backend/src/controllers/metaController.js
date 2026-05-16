import { config } from '../config/env.js';
import { openApiDocument } from '../docs/openapi.js';

export function health(req, res) {
  res.json({
    message: 'Notes App API',
    docs: '/openapi.json',
    about: '/about'
  });
}

export function about(req, res) {
  res.json({
    name: config.aboutName,
    email: config.aboutEmail,
    'my features': {
      Favorites: 'Users can mark important notes as favorites using PATCH /notes/{id}/favorite. I chose this because real notes apps need a fast way to surface high-priority notes.',
      Search: 'Users can search owned and shared notes with GET /search?q=keyword. This makes the product useful once a user has more than a handful of notes.',
      Pagination: 'GET /notes supports page and limit query parameters and returns pagination headers to keep large note collections efficient.'
    }
  });
}

export function openApi(req, res) {
  res.json(openApiDocument);
}
