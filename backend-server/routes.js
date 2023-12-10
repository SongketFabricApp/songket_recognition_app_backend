// Import dari Handler
const {
    getAllUsers,
    getUsers,
    makeUsers,
    deleteUsers,
} = require("./handler/users");
const {
    makeDataset,
    editDataset,
    getDataset,
    getAllDataset,
    deleteDataset,
} = require("./handler/dataset")


const routes = [
    // users - Ambil Seluruh Data Users
    {
        method: "GET",
        path: '/users',
        handler: getAllUsers,
    },
    // users - Ambil Data Users Tertentu
    {
        method: "GET",
        path: "/users/{id}",
        handler: getUsers,
    },
    // users - Buat Data Users Baru
    {
        method: "POST",
        path: "/users",
        handler: makeUsers,
    },

    // users - Hapus Data Users Tertentu
    {
        method: "DELETE",
        path: "/users/{id}",
        handler: deleteUsers,
    },

    

    // dataset - Ambil Seluruh Data Dataset
    {
        method: "GET",
        path: '/dataset',
        handler: getAllDataset,
    },
    // dataset - Ambil Data Dataset Tertentu
    {
        method: "GET",
        path: "/dataset/{id}",
        handler: getDataset,
    },
    // dataset - Buat Data Dataset Baru
    {
        method: "POST",
        path: "/dataset",
        handler: makeDataset,
        options: {
            payload: {
                maxBytes: 10485760,
                multipart: true,
                output: 'stream'
            },
        },
    },
    // dataset - Edit Data Users Tertentu
    {
        method: "PUT",
        path: "/dataset/{id}",
        handler: editDataset,
        options: {
            payload: {
                maxBytes: 10485760,
                multipart: true,
                output: 'stream'
            },
        },
    },

    // transaksi - Hapus Data Transaksi Tertentu
    {
        method: "DELETE",
        path: "/dataset/{id}",
        handler: deleteDataset,
    },

];

// Export Routes
module.exports = routes;