// Dependencies
const firebase_admin = require("firebase-admin");
const { Storage } = require("@google-cloud/storage");
const fs = require("fs");
const path = require("path");
const api_key = require("../private/key.json").api_key;
const bucketName = require("../private/key.json").storage_bucket;

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
            ...responseData, // include existing data
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
                users: [],
            });
            response.code(404); // Set the response status code to 404 Not Found
            return response;
        }

        const responseData = {
            error: false,
            message: "User fetched successfully",
            users: [userSnapshot.data()], // Store the user data in an array
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

// DELETE - Hapus Data User Tertentu
const deleteUsers = async (request, h) => {
    // Mengambil Kunci API dari Request Header
    const key = request.headers["x-api-key"];
    // Jika Kunci API Benar
    if (key === api_key) {
        const { id } = request.params;

        try {
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

            await outputDb.doc(id).delete();

            const firebaseUid = documentId.data().firebase_uid;
            await firebase_admin.auth().deleteUser(firebaseUid);

            return {
                error: false,
                message: "User Deleted",
            };
        } catch (error) {
            console.error("Error deleting user:", error);

            const response = h.response({
                error: true,
                message: "Internal Server Error",
            });
            response.code(500); // Internal Server Error
            return response;
        }
    }
    // Jika Kunci API Salah
    else {
        const response = h.response({
            error: true,
            message: "Unauthorized",
        });
        response.code(401);
        return response;
    }
};

module.exports = { getAllUsers, getUsers, deleteUsers};