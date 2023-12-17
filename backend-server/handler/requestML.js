const axios = require("axios");
const FormData = require("form-data");
const api_key = require("../private/key.json").ml_key;
const ml_backend = require("../private/key.json").ml_backend;
const fs = require("fs");

// Fungsi untuk mengirim permintaan ke API ML di dalam API backend
async function postImageWithAuthorization(imageFilePath, ml_backend) {
    const formData = new FormData();
    formData.append('image', fs.createReadStream(imageFilePath));

    const config = {
        headers: {
            'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
            'x-api-key': api_key,
        },
    };

    const response = await axios.post(`${ml_backend}/predict`, formData, config);
    return response.data;
}

// Fungsi untuk memprediksi kelas menggunakan ML server
async function predict_class(imageFilePath, mlServerLink) {

    // Contoh implementasi sederhana
    const modelResult = await postImageWithAuthorization(imageFilePath, mlServerLink);
    const predicted_class = modelResult.predicted_class;
    const dataset_info = modelResult.dataset_info;

    return [predicted_class, dataset_info];
}

// Fungsi predict - Memprediksi Objek kain
const predict = async (request, h) => {
    // Mengambil Kunci API dari Request Header
    const key = request.headers["x-api-key"];
    // Jika Kunci API Benar
    if (key === api_key) {
        // Try (jika request payload valid)
        try {
            const { image } = request.payload;

            // Simpan ke penyimpanan lokal
            const filename = '../../backend-server';
            const data = image._data;

            await new Promise((resolve, reject) => {
                fs.writeFile(filename, data, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });

            // Ganti dengan link ML server yang sesuai
            const mlServerLink = ml_backend;

            // Prediksi kelas menggunakan fungsi predict_class
            const [predicted_class, dataset_info] = await predict_class(filename, mlServerLink);

            // Hapus file lokal
            fs.unlink(filename, (err) => {
                if (err) {
                    console.error("Error deleting file:", err);
                }
            });

            const response = h.response({
                status: "success",
                data: {
                    predicted_class,
                    dataset_info,
                },
            });
            response.code(200);
            return response;
        } catch (error) {
            console.error("Error:", error);
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

module.exports = { predict };
