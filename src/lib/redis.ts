/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/unbound-method */

import redis from 'redis';
import { promisify } from 'util';

const config = {
  host: 'localhost',
  port: 6379,
};

export const client = redis.createClient(config);

const getAsync = promisify(client.get).bind(client);
const setAsync: (key: string, value: string, mode: string, duration: number) => Promise<unknown> =
  promisify(client.set).bind(client);
const delAsync = promisify(client.del).bind(client);
const scanAsync = promisify(client.scan).bind(client);

client.on('error', (err) => {
  console.error('Redis Error | ', err);
});

client.on('ready', () => {
  console.log('✓ CACHE: Redis is Ready.');
});

export default {
  getAsync,
  setAsync,
  delAsync,
  scanAsync,
};
