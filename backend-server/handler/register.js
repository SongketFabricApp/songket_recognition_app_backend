const firebase_admin = require("firebase-admin");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Function to generate a JWT token without expiration
const generateToken = (firebaseUid) => {
    const payload = {
        firebaseUid: firebaseUid,
        // Add any other user-related information you want in the token
    };

    const token = jwt.sign(payload, 'your_secret_key');

    return token;
};

// POST - Register User
const makeUsers = async (request, h) => {
    try {
        const { username, email, phone, password } = request.payload;

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 5);

        // Create user in Firebase Authentication
        const userRecord = await firebase_admin.auth().createUser({
            email: email,
            password: password,
        });

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

        const token = generateToken(userRecord.uid);

        return {
            error: false,
            message: "Register Success",
        };
    } catch (error) {
        // Catch (jika request payload tidak valid atau error saat membuat user)
        console.error("Error creating user:", error);

        const response = {
            error: true,
            message: "Internal Server Error",
        };

        // Check if the error is due to an existing email
        if (error.code === "auth/email-already-exists") {
            response.message = "Email address is already in use";
        }

        return response;
    }
};

module.exports = { makeUsers };