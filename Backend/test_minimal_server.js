import express from 'express';
import 'dotenv/config';
import connectDB from './src/config/db.js';
import config from './src/core/config/config.js';

const app = express();

app.get('/ping', (req, res) => res.send('pong'));

const start = async () => {
  try {
    console.log('Connecting to DB...');
    await connectDB();
    console.log('Listening on port 5001...');
    app.listen(5001, () => {
      console.log('Minimal server running');
      process.exit(0); // Exit immediately if it works for test
    });
  } catch (e) {
    console.error('Minimal server FAILED:', e);
    process.exit(1);
  }
};

start();
