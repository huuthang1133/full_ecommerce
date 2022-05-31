const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const upload = async (file) => {
  if (!file) {
    throw Error("No files were uploaded.");
  }

  const { createReadStream, filename, mimetype, encoding } = await file;

  const stream = createReadStream();

  if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
    removeTmp(pathName);
    throw Error("File format is incorrect.");
  }
  return new Promise((resolve, reject) => {
    const cloudinaryUpload = cloudinary.uploader.upload_stream(
      (err, result) => {
        if (err) {
          reject(err);
          throw Error(err);
        }
        resolve({ public_id: result.public_id, url: result.secure_url });
      }
    );
    stream.pipe(cloudinaryUpload);
  });
};

const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};

module.exports = upload;
