import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
  try {
    // Parse request body
    const { email, password } = req.body as { email: string; password: string };
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        email_verified_at: true
      }
    });

    // Check if user exists
    if (!user) {
      return res.status(400).json({
        errors: { email: "Invalid credentials" }
      });
    }

    // Check if email is verified
    if (!user.email_verified_at) {
      return res.status(400).json({
        errors: { email: "Please verify your email first" }
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        errors: { password: "Invalid credentials" }
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    // Return success response with token
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: "Internal server error" });
  }
}; 