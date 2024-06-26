const imagekit = require('../libs/imagekit');
const path = require('path');
const qr = require('qr-image');

module.exports = {
    // controller upload single image
    storageImageSingle: (req, res) => {
        let imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
        return res.status(200).json({
            status: true,
            message: 'success',
            data: {
                image_url: imageUrl
            }
        })
    },

    // controller upload multiple image
    storageImageMultiple: (req, res) => {
        let images = req.files.map(file => {
            return `${req.protocol}://${req.get('host')}/images/${file.filename}`;
        })
        return res.status(200).json({
            status: true,
            message: 'success',
            data: {
                image_url: images
            }
        })

    },

    // controller upload single video
    storageVideoSingle: (req, res) => {
        let videoUrl = `${req.protocol}://${req.get('host')}/videos/${req.file.filename}`;

        return res.status(200).json({
            status: true,
            message: 'success',
            data: {
                video_url: videoUrl
            }
        })
    },

    // controller upload multiple videos
    storageVideoMultiple: (req, res) => {
        let videoUrls = req.files.map(file => {
            return `${req.protocol}://${req.get('host')}/videos/${file.filename}`;
        });
        return res.status(200).json({
            status: true,
            message: 'success',
            data: {
                video_url: videoUrls
            }
        });
    },

    // controller upload single file
    storageFileSingle: (req, res) => {
        let fileUrl = `${req.protocol}://${req.get('host')}/documents/${req.file.filename}`;

        return res.status(200).json({
            status: true,
            message: 'success',
            data: {
                file_url: fileUrl
            }
        })
    },

    // controller upload multiple files
    storageFileMultiple: (req, res) => {
        let fileUrls = req.files.map(file => {
            return `${req.protocol}://${req.get('host')}/documents/${file.filename}`;
        });
        return res.status(200).json({
            status: true,
            message: 'success',
            data: {
                file_url: fileUrls
            }
        });
    },

    // handle imageKit disimpan di server
    imagekitUpload: async (req, res, next) => {
        try {


            const stringFile = req.file.buffer.toString('base64');

            const uploadFile = await imagekit.upload({
                fileName: Date.now() + path.extname(req.file.originalname),
                file: stringFile
            });

            return res.status(200).json({
                status: true,
                message: 'success',
                data: {
                    name: uploadFile.name,
                    url: uploadFile.url,
                    type: uploadFile.fileType
                }
            });

        } catch (error) {
            next(error);
        }
    },

    // handle qr generate disimpan di server
    generateQR: async (req, res, next) => {
        try {

            let { qr_data } = req.body;

            if (!qr_data) {
                return res.status(400).json({
                    status: false,
                    message: 'qr_Data is required',
                    data: null
                });
            };

            let qrCode = qr.imageSync(qr_data, { type: 'png' });

            let { url } = await imagekit.upload({
                fileName: Date.now() + '.png',
                file: qrCode.toString('base64')
            });

            return res.status(200).json({
                status: true,
                message: 'success',
                data: {
                    url
                }
            })

        } catch (err) {
            next(err);
        }
    }
}
