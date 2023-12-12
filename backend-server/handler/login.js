// Dependencies
const firebase_admin = require("firebase-admin");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import the jwt library

// POST - Login User
const loginUsers = async (request, h) => {
    // Mengambil Bearer Token dari Request Header
    const bearerToken = request.headers.authorization;

    // Jika Bearer Token Ada
    if (bearerToken) {
        // Try (jika request payload valid)
        try {
            // Decode the Bearer Token to get the user email
            const decodedToken = decodeBearerToken(bearerToken);

            if (!decodedToken) {
                return {
                    error: true,
                    message: "Invalid Bearer Token",
                };
            }

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

            // Authenticate user in Firebase
            const userRecord = await firebase_admin.auth().getUser(userData.firebase_uid);

            // Generate Firebase ID token
            const token = await firebase_admin.auth().createCustomToken(userRecord.uid);

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
    } else {
        // Jika Bearer Token Tidak Ada
        return {
            error: true,
            message: "Unauthorized: Bearer Token missing",
        };
    }
};

// Function to decode Bearer Token
const decodeBearerToken = (bearerToken) => {
    // Extract the token from the Bearer Token header
    const token = bearerToken.split(' ')[1];

    try {
        // Decode the token using jwt library
        const decodedToken = jwt.verify(token, 'your_secret_key');
        return decodedToken;
    } catch (error) {
        // Handle decoding error
        console.error("Error decoding Bearer Token:", error);
        return null;
    }
};

module.exports = { loginUsers };
