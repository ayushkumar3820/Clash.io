import { DefaultJobOptions } from "bullmq";
import IORedis from "ioredis";

const redis = new IORedis.default({
  host: process.env.REDIS_HOST || 'localhost',
  port: 6379,
  maxRetriesPerRequest: null
});

export const redisConnection = redis;

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