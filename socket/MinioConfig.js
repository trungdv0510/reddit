require("dotenv").config();
const Minio = require("minio");
const minioConfig = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT,
    port:9000,
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY
});
module.exports= {minioConfig};