import Redis from 'ioredis';
import { ConnectionOptions, DefaultJobOptions } from "bullmq";

const redisOptions: Redis.RedisOptions = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379", 10),
  password: process.env.REDIS_PASSWORD,
  maxLoadingRetryTime: undefined,
  maxRetriesPerRequest: null,
};

export const redisConnection = new Redis(redisOptions as any );

export const defaultQueueConfig: DefaultJobOptions = {
  removeOnComplete: {
    count: 20,
    age: 60 * 60,
  },
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 1000,
  },
};