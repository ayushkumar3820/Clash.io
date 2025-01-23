import { Job, Queue, Worker } from "bullmq";
import { defaultQueueConfig, redisConnection } from "../config/queue.js";
import { sendMail } from "../config/mail.js";
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const emailQueueName = "emailQueue";

export const emailQueue = new Queue(emailQueueName, {
  connection: redisConnection,
  defaultJobOptions: defaultQueueConfig,
});

// Generate verification token
const generateVerificationToken = (email: string) => {
  return jwt.sign(
    { email },
    process.env.JWT_SECRET as string,
    { expiresIn: '24h' }
  );
};

// Email templates
const getVerificationEmailTemplate = (verificationLink: string) => {
  return `
    <h1>Verify Your Email</h1>
    <p>Please click the link below to verify your email address:</p>
    <a href="${verificationLink}">Verify Email</a>
    <p>This link will expire in 24 hours.</p>
  `;
};

// * Workers
export const handler = new Worker(
  emailQueueName,
  async (job: Job) => {
    const data = job.data;
    console.log('Processing email job:', data);

    try {
      if (data.type === 'VERIFY_EMAIL') {
        const verificationToken = generateVerificationToken(data.to);
        console.log('Generated verification token for:', data.to);
        
        // Save verification token to database
        await prisma.user.update({
          where: { email: data.to },
          data: {
            email_verify_token: verificationToken,
            token_send_at: new Date()
          }
        });

        const verificationLink = `${process.env.APP_URL}api/verify-email?token=${verificationToken}`;
        
        // Send verification email
        const emailSent = await sendMail(
          data.to,
          "Verify Your Email",
          getVerificationEmailTemplate(verificationLink)
        );

        if (!emailSent) {
          throw new Error('Failed to send verification email');
        }
      }
    } catch (error) {
      console.error('Email queue error:', error);
      throw error;
    }
  },
  { 
    connection: redisConnection,
    concurrency: 5
  }
);

// Add error handler
handler.on('failed', (job: Job, error: Error) => {
  console.error(`Job ${job.id} failed:`, error);
});
