// Dependencies
const firebase_admin = require("firebase-admin");
const { Storage } = require("@google-cloud/storage");
const fs = require("fs");
const path = require("path");
const api_key = require("../private/key.json").api_key;
const bucketName = require("../private/key.json").storage_bucket;
const bcrypt = require('bcrypt');


//GET - Ambil Seluruh Data User
const getAllUsers = async (request, h) => {
    // Mengambil Kunci API dari Request Header
    const key = request.headers["x-api-key"];
    // Jika Kunci API Benar
    if (key === api_key) {
        const db = firebase_admin.firestore();
        const responseData = {};
        responseData["users"] = [];
        const outputDb = await db.collection("users");
        const snapshot = await outputDb.get();

        snapshot.forEach((doc) => {
            const dataObject = doc.data();
            responseData["users"].push(dataObject);
        });

        const response = h.response({
            error: false,
            message: "Users fetched successfully",
            users: responseData["users"], // Menggunakan array langsung
        });

        response.code(200);
        return response;
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

//GET - Ambil Data User Tertentu
const getUsers = async (request, h) => {
    // Mengambil Kunci API dari Request Header
    const key = request.headers["x-api-key"];
    // Jika Kunci API Benar
    if (key === api_key) {
        // Mengambil ID Users dari Request Params
        const { id } = request.params;

        const db = firebase_admin.firestore();
        const userSnapshot = await db.collection("users").doc(id).get();

        if (!userSnapshot.exists) {
            const response = h.response({
                error: false,
                message: "User not found",
                users: null,
            });
            response.code(404); // Set the response status code to 404 Not Found
            return response;
        }

        const responseData = {
            error: false,
            message: "User fetched successfully",
            users: userSnapshot.data(), // Store the user data in an array
        };

        const response = h.response(responseData);
        response.code(200);
        return response;
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

// PUT - Edit Data User Tertentu
const editUsers = async (request, h) => {
    // Mengambil Kunci API dari Request Header
    const key = request.headers["x-api-key"];
    // Jika Kunci API Benar
    if (key === api_key) {
        try {
            // Mengambil ID Users dari Request Params
            const { id } = request.params;

            // Ensure request.payload and required fields are defined
            const { payload } = request;
            if (!payload || (!payload.username && !payload.email && !payload.phone && !payload.password)) {
                const response = h.response({
                    error: true,
                    message: "Invalid payload. At least one of 'username', 'email', 'phone', or 'password' is required for the update.",
                });
                response.code(400); // Bad Request
                return response;
            }

            const db = firebase_admin.firestore();
            const outputDb = db.collection("users");

            const documentId = await outputDb.doc(id).get();

            // Check if the user exists
            if (!documentId.exists) {
                const response = h.response({
                    error: true,
                    message: "User not found",
                });
                response.code(404); // Not Found
                return response;
            }

            // Perform the update operation
            const updateData = {};
            if (payload.username) updateData.username = payload.username;
            if (payload.email) {
                updateData.email = payload.email;
                // Update the email in Firebase Authentication
                await firebase_admin.auth().updateUser(documentId.data().token, { email: payload.email });
            }
            if (payload.phone) updateData.phone = payload.phone;
            if (payload.password) {
                // Hash the new password before storing it
                const hashedPassword = await bcrypt.hash(payload.password, 5);
                updateData.password = hashedPassword;
                
                // Update the password in Firebase Authentication
                await firebase_admin.auth().updateUser(documentId.data().token, { password: payload.password });
            }

            await outputDb.doc(id).update(updateData);

            const updatedUserSnapshot = await outputDb.doc(id).get();
            const responseData = {
                error: false,
                message: "User updated successfully",
                users: updatedUserSnapshot.data(), // Store the updated user data in an array
            };

            const response = h.response(responseData);
            response.code(200);
            return response;
        } catch (error) {
            console.error("Error updating user:", error);

            const response = h.response({
                error: true,
                message: "Internal Server Error",
            });
            response.code(500); // Internal Server Error
            return response;
        }
    } else {
        const response = h.response({
            error: true,
            message: "Unauthorized",
        });
        response.code(401);
        return response;
    }
};

module.exports = { getAllUsers, getUsers, editUsers};