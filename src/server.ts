import os from 'os';
import * as dotenv from 'dotenv';
import app from './app';
import startMongoDb from './lib/mongoose';

dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
};

/* Note that:
 * setInterval will NOT give you exact duration to run this function
 * Because nothing is pushed from Event Queue to Call Stack as long as Call Stack is not empty.
 * But for this use case, we don't care whether function is called in particular/exact time
 * (approximately 1 min period is more than enough to satisfy the requirements)
 */
/* const userEmailChecker = (duration = 60000) => {
  const intervalId = setInterval(() => {
    console.log('Add to queue | get users for sending report');
  }, duration);

  const stop = () => clearInterval(intervalId);
  return { stop };
}; */

const server = app.listen(config.port, () => {
  console.log('Connecting Mongo Db ...');
  startMongoDb()
    .then(() => console.log('✓ Mongo Db Connected.'))
    .catch((e) => console.log(e));

  console.log(
    `✓ SERVER: Listening at http://${os.hostname()}:${config.port} in ${config.env} environment.`,
  );

  // userEmailChecker(5000);
});

server.timeout = 25000; // sets timeout to 25 seconds
