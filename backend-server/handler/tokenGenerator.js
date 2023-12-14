// tokenGenerator.js

const crypto = require('crypto');

const generateToken = (email) => {
  // Create a random token using the email and current timestamp
  const token = crypto.createHash('sha256').update(email + Date.now().toString()).digest('hex');

  return token;
};

module.exports = generateToken;
