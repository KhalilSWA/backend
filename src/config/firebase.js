const serviceAccount = require('../../taswira-5d224-firebase-adminsdk-pump8-75ad394a40.json');
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "gs://taswira-5d224.appspot.com"
});

async function uploadFile(file, filename) {
    const bucket = admin.storage().bucket();
    const metadata = {
        metadata: {
            // This line is very important. It's to create a download token.
            firebaseStorageDownloadTokens: uuidv4()
        },
        contentType: 'image/jpeg',
        cacheControl: 'public, max-age=31536000',
    };

    // Uploads a local file to the bucket
    const data = await bucket.upload(file, {
        // Support for HTTP requests made with `Accept-Encoding: gzip`
        gzip: true,
        destination: filename,
        // By setting the option `destination`, you can change the name of the
        // object you are uploading to a bucket.
        metadata: metadata
    });

    const path = data[0].name;
    const _uuid = data[0].metadata.metadata.firebaseStorageDownloadTokens;
    const downloadUrl = "https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(path) + "?alt=media&token=" + _uuid;

    try {
        fs.unlinkSync(file)
        //file removed
    } catch(err) {
        console.error(err)
    }

    return downloadUrl;
}

async function deleteImageFromFirebase(uuid) {
    await admin.storage().bucket().file(`Posts/${uuid}`).delete();
}

module.exports = {
    uploadFile,
    deleteImageFromFirebase
}