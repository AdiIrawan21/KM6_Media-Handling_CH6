const express = require('express');
const router = express.Router();
const multer = require('multer');

const { image, video, file } = require('../libs/multer');

const { storageImageSingle, storageImageMultiple, storageVideoSingle, storageVideoMultiple, storageFileSingle, storageFileMultiple, imagekitUpload } = require('../controllers/media.controllers');

// upload single image
router.post('/upload/image', image.single('image'), storageImageSingle);

// upload multiple images
router.post('/upload/images', image.array('image'), storageImageMultiple);

// upload single video
router.post('/upload/video', video.single('video'), storageVideoSingle);

// upload multiple video
router.post('/upload/videos', video.array('video'), storageVideoMultiple);

// upload single file
router.post('/upload/document', file.single('file'), storageFileSingle);

// upload multiple file
router.post('/upload/documents', file.array('file'), storageFileMultiple);

//router imageKit
router.post('/imagekit', multer.single('image'), imagekitUpload);

module.exports = router;
