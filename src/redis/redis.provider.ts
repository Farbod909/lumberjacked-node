import { FactoryProvider } from '@nestjs/common';
import { Redis } from 'ioredis';

export const redisClientProvider: FactoryProvider<Redis> = {
  provide: 'REDIS_CLIENT',
  useFactory: async () => {
    const acceptableErrors = ['READONLY'];

    const redisInstance = new Redis({
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      reconnectOnError(err) {
        for (const targetError of acceptableErrors) {
          if (err.message.includes(targetError)) {
            // Only reconnect when the error contains one of the acceptable error keywords.
            return true;
          }
        }
      },
    });

    redisInstance.on('error', (err) => {
      for (const targetError of acceptableErrors) {
        if (err.message.includes(targetError)) {
          return;
        }
      }

      throw new Error(`Redis connection failed: ${err}`);
    });

    return redisInstance;
  },
  inject: [],
};
