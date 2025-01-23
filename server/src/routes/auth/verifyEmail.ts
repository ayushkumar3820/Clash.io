import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;
    
    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    // Verify token
    const decoded = jwt.verify(token as string, process.env.JWT_SECRET as string) as { email: string };
    
    // Update user
    const user = await prisma.user.update({
      where: { email: decoded.email },
      data: {
        email_verified_at: new Date(),
        email_verify_token: null,
        token_send_at: null
      }
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid token" });
    }

    // Redirect to success page
    res.redirect(`${process.env.CLIENT_URL}/auth/email-verified`);
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ error: "Email verification failed" });
  }
}; 