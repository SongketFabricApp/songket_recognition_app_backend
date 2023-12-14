const firebase_admin = require("firebase-admin");
const bcrypt = require('bcrypt');
const generateToken = require('./tokenGenerator');

// POST - Login User
const loginUsers = async (request, h) => {
  try {
    const { email, password } = request.payload;

    // Get user data from Firestore based on email
    const userQuery = await firebase_admin.firestore().collection('users')
      .where('email', '==', email)
      .get();

    if (userQuery.empty) {
      // User not found
      return {
        error: true,
        message: 'User not found',
      };
    }

    const userData = userQuery.docs[0].data();

    // Ensure that required fields exist in userData
    if (!userData || !userData.password || !userData.firebase_uid) {
      return {
        error: true,
        message: 'Invalid user data',
      };
    }

    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, userData.password);

    if (!passwordMatch) {
      // Incorrect password
      return {
        error: true,
        message: 'Invalid email or password',
      };
    }

    // Generate a new token and update the user data
    const newToken = generateToken(email);

    // Update the user's token in Firestore
    await firebase_admin.firestore().collection('users')
      .doc(userData.user_id)
      .update({
        firebase_uid: newToken,
      });

    const loginResult = {
      userId: userData.user_id,
      name: userData.username,
      email: userData.email,
      phone: userData.phone,
      token: newToken, // Updated token
    };

    return {
      error: false,
      message: 'Login Success',
      loginResult: loginResult,
    };
  } catch (error) {
    console.error('Error logging in:', error);
    return {
      error: true,
      message: 'Bad request',
    };
  }
};

module.exports = { loginUsers };
