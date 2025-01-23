import express from 'express';
import { verifyEmail } from '../routes/auth/verifyEmail.js';

const router = express.Router();

router.get('/verify-email', verifyEmail);

export default router;
