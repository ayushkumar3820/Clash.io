import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { emailQueue } from '../../jobs/EmailQueue.js';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Create user with only the fields that exist in the schema
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        email_verified_at: null,
        email_verify_token: null,
        token_send_at: null
      },
      select: {
        id: true,
        name: true,
        email: true,
        email_verified_at: true
      }
    });

    // Queue verification email
    console.log('Queueing verification email for:', email);
    await emailQueue.add('send-verification-email', {
      type: 'VERIFY_EMAIL',
      to: email,
    });

    return res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      error: 'Registration failed. Please try again.'
    });
  }
}; 