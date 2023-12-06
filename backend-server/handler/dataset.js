// Dependencies
const firebase_admin = require("firebase-admin");
const { Storage } = require("@google-cloud/storage");
const fs = require("fs");
const path = require("path");
const api_key = require("../private/key.json").api_key;
const bucketName = require("../private/key.json").storage_bucket;

// dataset - Buat Data Dataset Baru
const makeDataset = async (request, h) => {
    // Mengambil Kunci API dari Request Header
    const key = request.headers["x-api-key"];
    // Jika Kunci API Benar
    if (key === api_key) {
        // Try (jika request payload valid)
        try {
            const { fabricname, region, pattern, description, img_url } =
                request.payload;

            const fabricId = "fabric" + Date.now().toString();
            const filename = img_url.hapi.filename;
            const data = img_url._data;

            const storage = new Storage({
                keyFilename: path.join(__dirname, "../private/songketa.json"),
            });

            // The path to your file to upload
            const filePath =`./${filename}`;
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
            await outputDb.doc(fabricname).set({
                fabricname: fabricname,
                region: region,
                pattern: pattern,
                description: description,
                img_url: url,
            });

            const response = h.response({
                status: "success",
            });
            response.code(200);
            return response;
        } catch (error) {
            // Catch (jika request payload tidak valid)
            const response = h.response({
                status: "bad request",
            });
            response.code(400);
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

// dataset - Ambil Seluruh Dataset
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
            const dataObject = {};
            dataObject[doc.id] = doc.data();
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

// dataset - Ambil Data Dataset Tertentu
const getDataset = async (request, h) => {
    // Mengambil Kunci API dari Request Header
    const key = request.headers["x-api-key"];
    // Jika Kunci API Benar
    if (key === api_key) {
        // Mengambil ID Users dari Request Params
        const { id } = request.params;

        const db = firebase_admin.firestore();
        const responseData = (
            await db.collection("fabric").doc(id).get()
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



// dataset - Edit Data Dataset Tertentu
const editDataset = async (request, h) => {
    // Mengambil Kunci API dari Request Header
    const key = request.headers["x-api-key"];
    // Jika Kunci API Benar
    if (key === api_key) {
        // Try (jika request payload valid)
        const { id } = request.params;
        try {
            const { fabricname, region, pattern, description, img_url } =
                request.payload;

                const fabricId = "fabric" + Date.now().toString();
                const filename = img_url.hapi.filename;
                const data = img_url._data;
    
                const storage = new Storage({
                    keyFilename: path.join(__dirname, "../private/songketa.json"),
                });
    
                // The path to your file to upload
                const filePath =`./${filename}`;
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
            await outputDb.doc(id).set({
                fabricname: fabricname,
                region: region,
                pattern: pattern,
                description: description,
                img_url: url,
            });

            const response = h.response({
                status: "success",
            });
            response.code(200);
            return response;
        } catch (error) {
            // Catch (jika request payload tidak valid)
            const response = h.response({
                status: "bad request",
            });
            response.code(400);
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


module.exports = { getAllDataset, getDataset, makeDataset, editDataset, };