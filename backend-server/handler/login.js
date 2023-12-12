const firebase_admin = require("firebase-admin");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Function to generate a JWT token without expiration
const generateToken = (userData) => {
    const payload = {
        userId: userData.user_id,
        email: userData.email,
        // Add any other user-related information you want in the token
    };

    const token = jwt.sign(payload, 'your_secret_key');

    return token;
};

// POST - Login User
const loginUsers = async (request, h) => {
    try {
        const { email, password } = request.payload;

        // Get user data from Firestore based on email
        const userQuery = await firebase_admin.firestore().collection("users")
            .where("email", "==", email)
            .get();

        if (userQuery.empty) {
            // User not found
            return {
                error: true,
                message: "User not found",
            };
        }

        const userData = userQuery.docs[0].data();

        // Compare the provided password with the hashed password
        const passwordMatch = await bcrypt.compare(password, userData.password);

        if (!passwordMatch) {
            // Incorrect password
            return {
                error: true,
                message: "Invalid email or password",
            };
        }

        // Generate token
        const token = generateToken({
            user_id: userData.user_id,
            email: userData.email,
            // Add any other user-related information you want in the token
        });

        const loginResult = {
            userId: userData.user_id,
            name: userData.username,
            token: token,
        };

        return {
            error: false,
            message: "Login Success",
            loginResult: loginResult,
        };
    } catch (error) {
        console.error("Error logging in:", error);
        return {
            error: true,
            message: "Bad request",
        };
    }
};

module.exports = { loginUsers };
