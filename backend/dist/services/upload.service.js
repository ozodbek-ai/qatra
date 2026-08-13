import cloudinary from "../config/cloudinary.js";
export const uploadVideo = (file) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({
            resource_type: "video",
            folder: "qatra/videos",
        }, (error, result) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(result);
        });
        stream.end(file.buffer);
    });
};
export const uploadAvatar = (file) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({
            resource_type: "image",
            folder: "qatra/avatars",
            transformation: [
                {
                    width: 500,
                    height: 500,
                    crop: "fill",
                    gravity: "face",
                },
            ],
        }, (error, result) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(result);
        });
        stream.end(file.buffer);
    });
};
