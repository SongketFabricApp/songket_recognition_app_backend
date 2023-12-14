// Dependencies
const firebase_admin = require("firebase-admin");
const { Storage } = require("@google-cloud/storage");
const fs = require("fs");
const path = require("path");
const api_key = require("../private/key.json").api_key;
const bucketName = require("../private/key.json").storage_bucket;
const serviceAccount = require("../private/songketa.json");

// Function to verify the bearer token
const verifyToken = async (token) => {
  try {
    // Use the Firebase Admin SDK to verify the token
    const decodedToken = await firebase_admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    // Handle errors (e.g., token is invalid)
    console.error("Error verifying token:", error);
    return null;
  }
};

// Middleware for bearer token authentication
const authenticateBearerToken = async (request, h) => {
  // Get the bearer token from the request header
  const bearerToken = request.headers.authorization;

  if (!bearerToken || !bearerToken.startsWith('Bearer ', )) {
    // Token is not provided or in the wrong format
    const response = h.response({
      error: true,
      message: "Unauthorized",
    });
    response.code(401);
    return response;
  }

  const token = bearerToken.replace('Bearer ', '');

  // Verify the token
  const decodedToken = await verifyToken(token);

  if (!decodedToken) {
    // Token is not valid
    const response = h.response({
      error: true,
      message: "Unauthorized",
    });
    response.code(401);
    return response;
  }

  // Add token information to the request for route handlers
  request.auth = {
    decodedToken: decodedToken,
  };

  return h.continue;
};

// POST - Buat Data Dataset Baru
const makeDataset = async (request, h) => {
    try {
        // Menjalankan middleware autentikasi bearer token
        const response = await authenticateBearerToken(request, h);
        if (response) {
            return response;
        }

        const { fabricname, origin, pattern, description, img_url } = request.payload;

            const fabricId = "fabric" + Date.now().toString();
            const filename = img_url.hapi.filename;
            const data = img_url._data;

            const storage = new Storage({
                keyFilename: path.join(__dirname, "../private/songketa.json"),
            });

            // The path to your file to upload
            const filePath = `./${filename}`;
            const fileExtension = filename.split(".").pop();

            // The new ID for your GCS file
            const destFileName = `fabric/${fabricId}.${fileExtension}`;

            // file URL
            const url = `https://storage.googleapis.com/${bucketName}/${destFileName}`;

            async function uploadFile() {
                const options = {
                    destination: destFileName,
                };

                // Creates the new bucket
                await storage.bucket(bucketName).upload(filePath, options);

                // Making file public to the internet
                async function makePublic() {
                    await storage
                        .bucket(bucketName)
                        .file(destFileName)
                        .makePublic();
                }
                makePublic().catch(console.error);
            }

            fs.writeFile(filename, data, async (err) => {
                if (!err) {
                    await uploadFile().catch(console.error);
                    fs.unlink(filename, (err) => {
                        if (err) {
                            console.error("Error deleting file:", err);
                        } else {
                        }
                    });
                }
            });

            const db = firebase_admin.firestore();
            const outputDb = db.collection("dataset");
            const newDocumentRef = outputDb.doc();
            const documentId = newDocumentRef.id;
            await newDocumentRef.set({
                idfabric: documentId,
                fabricname: fabricname,
                origin: origin,
                pattern: pattern,
                description: description,
                img_url: url,
            });

            return {
                error: false,
                message: "Dataset Created",
            };
        } catch (error) {
            console.error("Error creating dataset:", error);
            const response = h.response({
                error: true,
                message: "Internal Server Error",
            });
            response.code(500);
            return response;
        }
    };
    

//GET - Ambil Seluruh Dataset
const getAllDataset = async (request, h) => {
    // Mengambil Kunci API dari Request Header
    const key = request.headers["x-api-key"];
    // Jika Kunci API Benar
    if (key === api_key) {
        const db = firebase_admin.firestore();
        const responseData = {};
        responseData["dataset"] = [];
        const outputDb = await db.collection("dataset");
        const snapshot = await outputDb.get();

        snapshot.forEach((doc) => {
            const dataObject = doc.data();
            responseData["dataset"].push(dataObject);
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

// GET - Ambil Data Dataset Tertentu
const getDataset = async (request, h) => {
    try {
        // Mengambil Firebase UID dari Request
        const decodedToken = request.auth.decodedToken;

            if (!decodedToken || !decodedToken.firebase_uid) {
                // Token tidak valid
                const response = h.response({
                    status: "unauthorized",
                });
                response.code(401);
                return response;
            }

        const firebaseUid = decodedToken.firebase_uid;

        const { id } = request.params;
        const db = firebase_admin.firestore();
        // Use .limit(1) to retrieve a single document
        const snapshot = await db.collection("dataset")
            .where("idfabric", "==", id)
            .where("firebase_uid", "==", firebaseUid)
            .limit(1)
            .get();

        if (snapshot.empty) {
            // Dataset not found or unauthorized
            const response = h.response({
                status: "unauthorized",
            });
            response.code(401);
            return response;
        }

        // Extract the data from the first document in the snapshot
        const responseData = snapshot.docs[0].data();

        // Respond with the dataset
        const response = h.response(responseData);
        response.code(200);
        return response;
    } catch (error) {
        console.error("Error getting dataset:", error);
        const response = h.response({
            error: true,
            message: "Internal Server Error",
        });
        response.code(500);
        return response;
    }
};

// PUT - Edit Data Dataset Tertentu
const editDataset = async (request, h) => {
    // Mengambil Firebase UID dari Request
    const firebaseUid = request.auth.decodedToken.firebaseUid;

    // Continue with your logic to fetch dataset
    const { id } = request.params;
    const db = firebase_admin.firestore();
    const responseData = (
        await db.collection("dataset").where("idfabric", "==", id).where("firebase_uid", "==", firebaseUid).get()
    ).docs.map(doc => doc.data());

    if (responseData.length === 0) {
        const response = h.response({
            status: "unauthorized",
        });
        response.code(401);
        return response;
    }

    try {
        const { idfabric, fabricname, origin, pattern, description, img_url } =
            request.payload;

        const fabricId = "fabric" + Date.now().toString();
        const filename = img_url.hapi.filename;
        const data = img_url._data;

        const storage = new Storage({
            keyFilename: path.join(__dirname, "../private/songketa.json"),
        });

        // The path to your file to upload
        const filePath = `./${filename}`;
        const fileExtension = filename.split(".").pop();

        // The new ID for your GCS file
        const destFileName = `fabric/${fabricId}.${fileExtension}`;

        // file URL
        const url = `https://storage.googleapis.com/${bucketName}/${destFileName}`;

        async function uploadFile() {
            const options = {
                destination: destFileName,
            };

                // Creates the new bucket
                await storage.bucket(bucketName).upload(filePath, options);

                // Making file public to the internet
                async function makePublic() {
                    await storage
                        .bucket(bucketName)
                        .file(destFileName)
                        .makePublic();
                }
                makePublic().catch(console.error);
            }

            fs.writeFile(filename, data, async (err) => {
                if (!err) {
                    await uploadFile().catch(console.error);
                    fs.unlink(filename, (err) => {
                        if (err) {
                            console.error("Error deleting file:", err);
                        } else {
                        }
                    });
                }
            });

            const db = firebase_admin.firestore();
            const outputDb = db.collection("dataset");

            // Use the existing document ID for editing
            await outputDb.doc(id).update({
                idfabric: id,
                fabricname: fabricname,
                origin: origin,
                pattern: pattern,
                description: description,
                img_url: url,
                firebase_uid: firebaseUid,
            });

            return {
                error: false,
                message: "Dataset Edited",
            };
        } catch (error) {
            // Catch (jika request payload tidak valid)
            console.error("Error editing dataset:", error);
            return {
                error: true,
                message: "Bad Request",
            };
        }
    };

// DELETE - Hapus Data Dataset Tertentu
const deleteDataset = async (request, h) => {
    // Mengambil Firebase UID dari Request
    const firebaseUid = request.auth.decodedToken.firebaseUid;

    // Continue with your logic to fetch dataset
    const { id } = request.params;
    const db = firebase_admin.firestore();
    const responseData = (
        await db.collection("dataset").where("idfabric", "==", id).where("firebase_uid", "==", firebaseUid).get()
    ).docs.map(doc => doc.data());

    if (responseData.length === 0) {
        const response = h.response({
            status: "unauthorized",
        });
        response.code(401);
        return response;
    }

    try {
        const outputDb = db.collection("dataset");

        // Use the Firebase UID from the registration process for authorization
        const firebaseUid = request.auth.decodedToken.firebaseUid;

        // Delete the dataset
        await outputDb.doc(id).delete();

        return {
            error: false,
            message: "Dataset Deleted",
        };
    } catch (error) {
        console.error("Error deleting dataset:", error);

            const response = h.response({
                error: true,
                message: "Internal Server Error",
            });
            response.code(500); // Internal Server Error
            return response;
        }
    };

module.exports = { getAllDataset, getDataset, makeDataset, editDataset, deleteDataset, authenticateBearerToken };