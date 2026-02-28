import express from 'express';
import { login, register, refresh, logout, getProfile } from './auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import {googleAuth, googleAuthCallback} from "@/auth/google.oauth.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);

router.get('/me', authenticate, getProfile);

router.get('/google', googleAuth);
router.get('/google/callback', googleAuthCallback);

export default router;
