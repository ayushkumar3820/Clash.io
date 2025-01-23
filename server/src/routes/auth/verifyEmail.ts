import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: 'Verification token is required' });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        email_verify_token: token as string,
        token_send_at: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      return res.status(400).json({ 
        error: 'Invalid or expired verification token' 
      });
    }

    // Update user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        email_verified_at: new Date(),
        email_verify_token: null,
        token_send_at: null
      }
    });

    return res.status(200).json({ 
      message: 'Email verified successfully' 
    });
  } catch (error) {
    console.error('Email verification error:', error);
    return res.status(500).json({ 
      error: 'Something went wrong during email verification' 
    });
  }
}; 