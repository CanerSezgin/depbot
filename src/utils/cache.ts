import redis from '../lib/redis';

interface CacheConfig {
  key: string;
  expire: number;
  grace?: number; // not supported for the sake of simplicity but use in enterprise version.
}

export const cached = async (
  cacheConfig: CacheConfig,
  cb: (...args: any[]) => Promise<any>,
  ...args: any[]
) => {
  /* if (args.length) {
      cb = cb.bind(null, ...args);
    } */

  console.log(cb, args);

  const cachedData = await redis.getAsync(cacheConfig.key);
  console.log({ cachedData });
  if (cachedData) return JSON.parse(cachedData) as Global.UnknownObj;

  console.log("Getting Data from Service (Run CB)")
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data = await cb(...args);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const r = await redis.setAsync(cacheConfig.key, JSON.stringify(data), 'EX', cacheConfig.expire);
  console.log({ r });
  console.log({ data });
  return true;
};

export const x = 1;
