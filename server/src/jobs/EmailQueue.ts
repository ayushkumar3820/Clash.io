import { Job, Queue, Worker } from "bullmq";
import { defaultQueueConfig, redisConnection } from "../config/queue.js";
import { sendMail } from "../config/mail.js";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const emailQueueName = "emailQueue";

export const emailQueue = new Queue(emailQueueName, {
  connection: redisConnection,
  defaultJobOptions: defaultQueueConfig,
});

// Generate verification token
const generateVerificationToken = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
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

    if (data.type === 'VERIFY_EMAIL') {
      const verificationToken = generateVerificationToken();
      
      // Save verification token to database
      await prisma.user.update({
        where: { email: data.to },
        data: {
          email_verify_token: verificationToken,
          token_send_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        }
      });

      // Create verification link
      const verificationLink = `${process.env.APP_URL}api/verify-email?token=${verificationToken}`;
      
      // Send verification email
      await sendMail(
        data.to,
        "Verify Your Email",
        getVerificationEmailTemplate(verificationLink)
      );
    } else {
      // Handle other types of emails
      await sendMail(data.to, data.subject, data.html);
    }
  },
  { connection: redisConnection }
);
