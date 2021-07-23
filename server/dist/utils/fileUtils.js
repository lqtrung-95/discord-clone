"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFromBuffer = void 0;
const dotenv_1 = require("dotenv");
const path = require("path");
dotenv_1.config();
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const formatName = (filename) => {
    const file = path.parse(filename);
    const name = file.name;
    const ext = file.ext;
    const date = Date.now();
    const cleanFileName = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return `${date}-${cleanFileName}${ext}`;
};
const uploadFromBuffer = (buffer) => {
    return new Promise((resolve, reject) => {
        const cld_upload_stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) {
                resolve(result);
            }
            else {
                reject(error);
            }
        });
        const data = streamifier
            .createReadStream(buffer.buffer)
            .pipe(cld_upload_stream);
        return data;
    });
};
exports.uploadFromBuffer = uploadFromBuffer;
//# sourceMappingURL=fileUtils.js.map