import { Router } from "express";
import AuthRoutes from "./authRoutes.js";
import ClashRoutes from "./clashRoutes.js";
import VerifyRoutes from "./verifyRoutes.js";
import express from 'express';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use("/api", AuthRoutes);
router.use("/api/clash", authMiddleware, ClashRoutes);
router.use("/", VerifyRoutes);

export default router;
