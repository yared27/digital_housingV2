/**
 * Simple Node script that attempts to connect to MongoDB using mongoose.
 * Exits with code 0 when successful, retries until success.
 *
 * Usage: node ./scripts/wait-for-mongo.js
 */
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || 'mongodb://mongodb:27017/digital_housing_dev';
const maxRetries = parseInt(process.env.WAIT_MAX_RETRIES || '30', 10);
const retryInterval = parseInt(process.env.WAIT_RETRY_INTERVAL || '2000', 10);

let attempts = 0;

(async function wait() {
  while (attempts < maxRetries) {
    try {
      attempts++;
      console.log(`Attempt ${attempts} to connect to MongoDB at ${uri}...`);
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
      console.log('MongoDB is available. Continuing startup.');
      await mongoose.connection.close();
      process.exit(0);
    } catch (err) {
      console.log('MongoDB not ready yet:', err.message);
      await new Promise((r) => setTimeout(r, retryInterval));
    }
  }
  console.error(`Unable to connect to MongoDB after ${maxRetries} attempts.`);
  process.exit(1);
})();