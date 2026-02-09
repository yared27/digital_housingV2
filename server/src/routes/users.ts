import express from 'express';
import { getMe, updateMe } from '../controllers/users.controller';
import { requireAuth } from '../middlewares/auth';

const router = express.Router();
router.get('/me', requireAuth, getMe);
router.put('/me', requireAuth, updateMe);

export default router;