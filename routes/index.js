const express = require('express');
const router = express.Router();
// const multer = require('multer');

const { image, file, imageStorage, videoStorage, fileStorage } = require('../libs/multer');

const { storageImageSingle, storageImageMultiple, storageVideoSingle, storageVideoMultiple, storageFileSingle, storageFileMultiple, imagekitUpload, generateQR } = require('../controllers/media.controllers');

// upload single image
router.post('/upload/image', imageStorage.single('image'), storageImageSingle);

// upload multiple images
router.post('/upload/images', imageStorage.array('image'), storageImageMultiple);

// upload single video
router.post('/upload/video', videoStorage.single('video'), storageVideoSingle);

// upload multiple video
router.post('/upload/videos', videoStorage.array('video'), storageVideoMultiple);

// upload single file
router.post('/upload/document', fileStorage.single('file'), storageFileSingle);

// upload multiple file
router.post('/upload/documents', fileStorage.array('file'), storageFileMultiple);

//router hanlde proccess imageKit
router.post('/imagekit/upload/image', image.single('file'), imagekitUpload);

router.post('/imagekit/upload/document', file.single('file'), imagekitUpload);

// handle routes qr
router.post('/qr/generate', file.single('file'), generateQR);

module.exports = router;
