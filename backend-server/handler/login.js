const firebase_admin = require("firebase-admin");
const bcrypt = require('bcrypt');

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
    if (!userData || !userData.password) {
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

    const loginResult = {
      userId: userData.userId,
      username: userData.username,
      email: userData.email,
      phone: userData.phone,
      token: userData.token,
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
