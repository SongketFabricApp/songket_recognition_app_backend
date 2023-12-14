// Dependencies
const firebase_admin = require("firebase-admin");
const { Storage } = require("@google-cloud/storage");
const fs = require("fs");
const path = require("path");
const api_key = require("../private/key.json").api_key;
const bucketName = require("../private/key.json").storage_bucket;

// POST - Buat Data Dataset Baru
const makeDataset = async (request, h) => {
    // Mengambil Kunci API dari Request Header
    const key = request.headers["x-api-key"];
    // Jika Kunci API Benar
    if (key === api_key) {
        // Try (jika request payload valid)
        try {
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
            // Catch (jika request payload tidak valid)
            console.error("Error creating dataset:", error);
            return {
                error: true,
                message: "Bad Request",
            };
        }
    }
    // Jika Kunci API Salah
    else {
        return {
            error: true,
            message: "Unauthorized",
        };
    }
};

//GET - Ambil Seluruh Dataset
const getAllDataset = async (request, h) => {
    try {
        // Mengambil Kunci API dari Request Header
        const key = request.headers["x-api-key"];

        if (key !== api_key) {
            // Jika Kunci API Salah
            throw new Error("Unauthorized");
        }

        const db = firebase_admin.firestore();
        const dataset = [];
        const outputDb = await db.collection("dataset");
        const snapshot = await outputDb.get();

        snapshot.forEach((doc) => {
            const dataObject = doc.data();
            dataset.push(dataObject);
        });

        return {
            error: false,
            message: "Dataset fetched successfully",
            dataset: dataset,
        };
    } catch (error) {
        console.error("Error fetching dataset:", error);

        return {
            error: true,
            message: "Unauthorized",
        };
    }
};

//GET - Ambil Data Dataset Tertentu
const getDataset = async (request, h) => {
    try {
        // Mengambil Kunci API dari Request Header
        const key = request.headers["x-api-key"];

        if (key !== api_key) {
            // Jika Kunci API Salah
            throw new Error("Unauthorized");
        }

        // Mengambil ID Users dari Request Params
        const { id } = request.params;

        const db = firebase_admin.firestore();
        const responseData = (
            await db.collection("dataset").doc(id).get()
        ).data();

        if (!responseData) {
            throw new Error("Dataset not found");
        }

        return {
            error: false,
            message: "Dataset fetched successfully",
            datasetItem: responseData,
        };
    } catch (error) {
        console.error("Error fetching dataset:", error);

        return {
            error: true,
            message: error.message || "Unauthorized",
        };
    }
};


// PUT - Edit Data Dataset Tertentu
const editDataset = async (request, h) => {
    // Mengambil Kunci API dari Request Header
    const key = request.headers["x-api-key"];
    // Jika Kunci API Benar
    if (key === api_key) {
        // Try (jika request payload valid)
        const { id } = request.params;
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
    }
    // Jika Kunci API Salah
    else {
        return {
            error: true,
            message: "Unauthorized",
        };
    }
};

// DELETE - Hapus Data Dataset Tertentu
const deleteDataset = async (request, h) => {
    // Mengambil Kunci API dari Request Header
    const key = request.headers["x-api-key"];
    // Jika Kunci API Benar
    if (key === api_key) {
        const { id } = request.params;

        try {
            const db = firebase_admin.firestore();
            const outputDb = db.collection("dataset");

            // Check if the dataset exists
            const documentId = await outputDb.doc(id).get();
            if (!documentId.exists) {
                const response = h.response({
                    error: true,
                    message: "Dataset not found",
                });
                response.code(404); // Not Found
                return response;
            }

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

module.exports = { getAllDataset, getDataset, makeDataset, editDataset, deleteDataset };