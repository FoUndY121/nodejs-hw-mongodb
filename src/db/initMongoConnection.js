const mongoose = require('mongoose');

async function initMongoConnection() {
  const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } =
    process.env;
  const connectionString = `${MONGODB_URL.replace('<username>', MONGODB_USER).replace('<password>', MONGODB_PASSWORD)}/${MONGODB_DB}`;

  try {
    await mongoose.connect(connectionString);
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Mongo connection error:', error);
    process.exit(1);
  }
}

module.exports = { initMongoConnection };
