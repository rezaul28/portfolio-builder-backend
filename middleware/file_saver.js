const multer = require('multer');
const uuid = require('uuidv1');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}
module.exports.fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Files');
    },
    filename: (req, file, cb) => {
        cb(null, uuid() + '.'+file.originalname);
    }
})

module.exports.photo = (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : 'Invalid mime type!';
    cb(error, isValid);
}