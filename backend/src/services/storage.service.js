
const ImageKit = require("imagekit");

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

async function uploadFile(buffer, fileName) {
    try {
        const result = await imagekit.upload({
            file: buffer.toString("base64"),
            fileName: fileName,
            folder: "/posts"
        });

        return result.url;
    } catch (error) {
        throw new Error(`ImageKit upload failed: ${error.message}`);
    }
}

module.exports = { uploadFile };
