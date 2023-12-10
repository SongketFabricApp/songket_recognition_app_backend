// Dependencies
const firebase_admin = require("firebase-admin");
const { Storage } = require("@google-cloud/storage");
const fs = require("fs");
const path = require("path");
const api_key = require("../private/key.json").api_key;
const bucketName = require("../private/key.json").storage_bucket;
const bcrypt = require('bcrypt');

//POST - Register User
const makeUsers = async (request, h) => {
    // Mengambil Kunci API dari Request Header
    const key = request.headers["x-api-key"];
    // Jika Kunci API Benar
    if (key === api_key) {
        // Try (jika request payload valid)
        try {
            const { username, email, phone, password} =
                request.payload;

            // Hash the password before storing it
            const hashedPassword = await bcrypt.hash(password, 5);

            // Create user in Firebase Authentication
            const userRecord = await firebase_admin.auth().createUser({
                email: email,
                password: password,
            });

            // Obtain the ID token from the created user
            const idToken = await firebase_admin.auth().createCustomToken(userRecord.uid);

            const db = firebase_admin.firestore();
            const outputDb = db.collection("users");
            const newDocumentRef = outputDb.doc();
            const documentId = newDocumentRef.id;

            await newDocumentRef.set({
                user_id: documentId,
                username: username,
                email: email,
                phone: phone,
                password: hashedPassword,
                firebase_uid: userRecord.uid,
            });

            const response = h.response({
                status: "success",
                token: idToken,
            });
            response.code(200);
            return response;
        } catch (error) {
            // Catch (jika request payload tidak valid atau error saat membuat user)
            console.error("Error creating user:", error);
            const response = h.response({
                status: "bad request",
            });

            // Check if the error is due to an existing email
            if (error.code === "auth/email-already-exists") {
                response.message = "Email address is already in use";
                response.code(400); // Bad Request
            } else {
                response.code(500); // Internal Server Error
            }

            return response;
        }
    }
    // Jika Kunci API Salah
    else {
        const response = h.response({
            status: "unauthorized",
        });
        response.code(401);
        return response;
    }
};

module.exports = {makeUsers};