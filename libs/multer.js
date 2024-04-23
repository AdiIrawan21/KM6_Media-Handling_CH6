const multer = require('multer');
const path = require('path');

// function untuk mengganti nama file yang diupload
const filename = (req, file, callback) => {
    let fileName = Date.now() + path.extname(file.originalname);

    callback(null, fileName);

};

// functiom untuk menyimpan media yang diupload
const generateStorage = (destination) => {
    return multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, destination);
        },

        filename
    });
};

// function untuk validasi/middleware tipe media
const generateFileFilter = (mimetypes) => {
    return (req, file, callback) => {
        if (mimetypes.includes(file.mimetype)) {
            callback(null, true);
        } else {
            let err = new Error(`Only ${mimetypes} are allowed to upload!`);
            callback(err, false);
        }
    };
};

module.exports = {
    // multer untuk images
    image: multer({
        storage: generateStorage('./public/images'),
        fileFilter: generateFileFilter([
            'image/png', 'image/jpg', 'image/jpeg'
        ]),
        onError: (err, next) => {
            next(err);
        }
    }),

    // multer untuk videos
    video: multer({
        storage: generateStorage('./public/videos'),
        fileFilter: generateFileFilter([
            'video/mp4', 'video/mpeg', 'video/mov'
        ]),
        onError: (err, next) => {
            next(err);
        }
    }),

    // multer untuk files
    file: multer({
        storage: generateStorage('./public/documents'),
        fileFilter: generateFileFilter([
            'application/pdf',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]),
        onError: (err, next) => {
            next(err);
        }
    })
};