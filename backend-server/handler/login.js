// Dependencies
const firebase_admin = require("firebase-admin");
const { Storage } = require("@google-cloud/storage");
const fs = require("fs");
const path = require("path");
const api_key = require("../private/key.json").api_key;
const bucketName = require("../private/key.json").storage_bucket;
const { makeUsers } = require('./register');

// users - Login User
const loginUsers = async (request, h) => {
    // Mengambil Kunci API dari Request Header
    const key = request.headers["x-api-key"];
    // Jika Kunci API Benar
    if (key === api_key) {
        try {
            const { email, password } = request.payload;

            const userRecord = await firebase_admin.auth().makeUsers(email, password);
            const uid = userRecord.user.uid;

            // You can perform additional logic here if needed

            const response = h.response({
                status: "success",
                firebase_uid: uid,
            });
            response.code(200);
            return response;
        } catch (error) {
            console.error("Error logging in:", error);
            const response = h.response({
                status: "bad request",
            });

            // Check if the error is due to invalid credentials
            if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
                response.message = "Invalid email or password";
                response.code(401); // Unauthorized
            } else {
                response.code(500); // Internal Server Error
            }

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
