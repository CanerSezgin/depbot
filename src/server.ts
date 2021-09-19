import os from 'os';
import * as dotenv from 'dotenv';
import app from './app';
import startMongoDb from './lib/mongoose';
import sendReportInterval from './intervals/sendReport';

dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
};

const server = app.listen(config.port, () => {
  console.log('Connecting Mongo Db ...');
  startMongoDb()
    .then(() => console.log('✓ Mongo Db Connected.'))
    .catch((e) => console.log(e));

  console.log(
    `✓ SERVER: Listening at http://${os.hostname()}:${config.port} in ${config.env} environment.`,
  );

  sendReportInterval(60000); // 1 min
});

server.timeout = 25000; // sets timeout to 25 seconds
