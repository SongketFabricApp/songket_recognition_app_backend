// Dependencies
const firebase_admin = require("firebase-admin");
const api_key = require("../private/key.json").api_key;
const bcrypt = require('bcrypt');

// POST - Login User
const loginUsers = async (request, h) => {
    // Mengambil Kunci API dari Request Header
    const key = request.headers["x-api-key"];
    // Jika Kunci API Benar
    if (key === api_key) {
        // Try (jika request payload valid)
        try {
            const { email, password } = request.payload;

            // Get user data from Firestore based on email
            const userQuery = await firebase_admin.firestore().collection("users")
                .where("email", "==", email)
                .get();

            if (userQuery.empty) {
                // User not found
                const response = h.response({
                    status: "not found",
                });
                response.code(404);
                return response;
            }

            const userData = userQuery.docs[0].data();
            
            // Compare the provided password with the hashed password
            const passwordMatch = await bcrypt.compare(password, userData.password);

            if (!passwordMatch) {
                // Incorrect password
                const response = h.response({
                    status: "unauthorized",
                    message: "Invalid email or password",
                });
                response.code(401);
                return response;
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

            const response = h.response({
                status: "Login Success",
                loginResult: loginResult,
            });
            response.code(200);
            return response;
        } catch (error) {
            console.error("Error logging in:", error);
            const response = h.response({
                status: "bad request",
            });
            response.code(400);
            return response;
        }
    } else {
        // Jika Kunci API Salah
        const response = h.response({
            status: "unauthorized",
        });
        response.code(401);
        return response;
    }
};

module.exports = { loginUsers };
