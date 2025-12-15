import { createClient, type RedisClientType } from 'redis'

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'; 

export const redisClient: RedisClientType = createClient({
  url: REDIS_URL
});

async function connectRedis(): Promise<void> {
  await redisClient.connect();
  console.log('Successfully connected to Redis');
}

redisClient.on('error', (err: Error) => {
  console.error('Redis connection error:', err);
});

connectRedis().catch(console.error);