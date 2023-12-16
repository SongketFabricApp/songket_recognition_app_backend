// Import dari Handler
const { getUsers, getAllUsers, deleteUsers, editUsers } = require("./handler/users")
const { makeUsers } = require("./handler/register")
const { loginUsers } = require("./handler/login")
const { makeDataset, editDataset, getDataset, getAllDataset, deleteDataset } = require("./handler/dataset")
const { predict } = require("./handler/requestML")

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
        path: "/register",
        handler: makeUsers,
    },

    // users - Buat Data Users Baru
    {
        method: "POST",
        path: "/login",
        handler: loginUsers,
    },

    // users - Buat Data Users Baru
    {
        method: "PUT",
        path: "/users/{id}",
        handler: editUsers,
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
    // dataset - Hapus Data Dataset Tertentu
    {
        method: "DELETE",
        path: "/dataset/{id}",
        handler: deleteDataset,
    },

    // predict - Buat Data Dataset Baru
    {
        method: "POST",
        path: "/predict",
        handler: predict,
        options: {
            payload: {
                maxBytes: 10485760,
                multipart: true,
                output: 'stream'
            },
        },
    },

];

// Export Routes
module.exports = routes;