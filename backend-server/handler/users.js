// Dependencies
const firebase_admin = require("firebase-admin");
const { Storage } = require("@google-cloud/storage");
const fs = require("fs");
const path = require("path");
const api_key = require("../private/key.json").api_key;
const bucketName = require("../private/key.json").storage_bucket;

// users - Ambil Seluruh Data Users
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

// users - Ambil Data Users Tertentu
const getUsers = async (request, h) => {
    // Mengambil Kunci API dari Request Header
    const key = request.headers["x-api-key"];
    // Jika Kunci API Benar
    if (key === api_key) {
        // Mengambil ID Users dari Request Params
        const { id } = request.params;

        const db = firebase_admin.firestore();
        const responseData = (
            await db.collection("users").doc(id).get()
        ).data();

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

// users - Buat Data Users Baru
const makeUsers = async (request, h) => {
    // Mengambil Kunci API dari Request Header
    const key = request.headers["x-api-key"];
    // Jika Kunci API Benar
    if (key === api_key) {
        // Try (jika request payload valid)
        try {
            const { username, email, phone, password,} =
                request.payload;

            const db = firebase_admin.firestore();
            const outputDb = db.collection("users");
            const newDocumentRef = outputDb.doc();
            const documentId = newDocumentRef.id;

            const userRecord = await firebase_admin.auth().createUser({
                email: email,
                password: password,
            });
            const uid = userRecord.uid;

            await newDocumentRef.set({
                user_id: documentId,
                username: username,
                email: email,
                phone: phone,
                password: password,
                firebase_uid: uid,
            });

            const response = h.response({
                status: "success", 
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

// users - Hapus Data Users Tertentu
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
                    status: "not found",
                    message: "User not found",
                });
                response.code(404); // Not Found
                return response;
            }
        
        await outputDb.doc(id).delete();

        const firebaseUid = documentId.data().firebase_uid;
        await firebase_admin.auth().deleteUser(firebaseUid);

        const response = h.response({
            status: "success",
        });
        response.code(200);
        return response;
    } catch (error) {
        console.error("Error deleting user:", error);

        const response = h.response({
            status: "bad request",
        });
        response.code(500); // Internal Server Error
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

module.exports = { getAllUsers, getUsers, makeUsers, deleteUsers};