import redis from '../lib/redis';

interface CacheConfig {
  key: string;
  expire: number;
  grace?: number; // not supported for the sake of simplicity but use in enterprise version.
}

export const cached = async <T>(
  cacheConfig: CacheConfig,
  cb: (...args: any[]) => Promise<T>,
  args: any[],
): Promise<T> => {
  const cachedData = await redis.getAsync(cacheConfig.key);

  if (cachedData) {
    console.log('reading from cache ...');
    return JSON.parse(cachedData) as T;
  } else {
    console.log('Getting Data from Service (Run CB)');
  }

  const data = await cb(...args);
  await redis.setAsync(cacheConfig.key, JSON.stringify(data), 'EX', cacheConfig.expire);
  return data;
};

export const x = 1;
