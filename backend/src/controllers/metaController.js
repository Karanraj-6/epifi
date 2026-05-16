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
      'AI Note Improvement': 'Integrated Gemini 2.5 Flash Lite using a sophisticated "Invisible Writing Assistant" prompt system. This feature doesn\'t just fix grammar; it interprets the user\'s intent, expands on fragmented thoughts, and enhances readability while strictly preserving the original tone, slang, and emotional rhythm. It includes a custom cleaning pipeline to strip markdown artifacts and a safety backup system for instant undos.',
      'Pagination Optimization': 'Implemented a high-performance numbered pagination system that utilizes server-side offsets and custom "X-Total-Count" CORS-exposed headers. This ensures the workspace remains lightning-fast even with massive note collections, using a 3-notes-per-page limit to demonstrate smooth navigation and state management between pages.',
      'Real-time Undo System': 'A safety-first "Reverse" feature that allows users to instantly discard AI changes and revert to their original note content with one click.',
      'Rich Text Engine': 'Transitioned from plain text to a full HTML-based content management system, enabling premium formatting like bold, lists, and semantic structure.',
      'Toast Notification UX': 'Integrated a global real-time feedback system that provides instant, non-intrusive status updates for all API actions (Saving, Sharing, AI Thinking, etc.).',
      'Favorites': 'Quick-access toggle for high-priority notes via dedicated PATCH endpoint for better organization.'
    }
  });
}

export function openApi(req, res) {
  res.json(openApiDocument);
}
