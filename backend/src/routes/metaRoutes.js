import express from 'express';
import { about, health, openApi } from '../controllers/metaController.js';

export const metaRouter = express.Router();

metaRouter.get('/', health);
metaRouter.get('/about', about);
metaRouter.get('/openapi.json', openApi);
