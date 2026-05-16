import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  createNote,
  deleteNote,
  getNote,
  listNotes,
  listSharedNotes,
  searchNotes,
  setFavorite,
  shareNote,
  updateNote,
  improveNote
} from '../controllers/noteController.js';

export const noteRouter = express.Router();

noteRouter.get('/notes', requireAuth, listNotes);
noteRouter.post('/notes', requireAuth, createNote);
noteRouter.post('/notes/improve', requireAuth, improveNote);
noteRouter.get('/notes/shared', requireAuth, listSharedNotes);
noteRouter.get('/notes/:id', requireAuth, getNote);
noteRouter.put('/notes/:id', requireAuth, updateNote);
noteRouter.delete('/notes/:id', requireAuth, deleteNote);
noteRouter.post('/notes/:id/share', requireAuth, shareNote);
noteRouter.patch('/notes/:id/favorite', requireAuth, setFavorite);
noteRouter.get('/search', requireAuth, searchNotes);
