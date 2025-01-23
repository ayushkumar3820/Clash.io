import express from 'express';
import { login } from '../routes/auth/login.js';
import { register } from '../routes/auth/register.js';
import { verifyEmail } from '../routes/auth/verifyEmail.js';

const router = express.Router();

router.post('/api/check/login', login);
router.post('/api/auth/register', register);
router.get('/api/verify-email', verifyEmail);

export default router;
