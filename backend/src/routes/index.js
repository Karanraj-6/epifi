import express from 'express';
import { authRouter } from './authRoutes.js';
import { metaRouter } from './metaRoutes.js';
import { noteRouter } from './noteRoutes.js';

export const router = express.Router();

router.use(metaRouter);
router.use(authRouter);
router.use(noteRouter);
