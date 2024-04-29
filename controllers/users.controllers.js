const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const imagekit = require('../libs/imagekit');
const path = require('path');
module.exports = {
    register: async (req, res, next) => {
        try {
            const { first_name, last_name, email, password } = req.body;

            let exist = await prisma.user.findFirst({ where: { email } })

            if (exist) {
                return res.status(400).json({
                    status: false,
                    message: 'email already used',
                    data: null
                })
            }

            // Validasi data jika tidak diisi
            if (!first_name || !last_name || !email || !password) {
                return res.status(400).json({
                    status: false,
                    message: `'first_name', 'last_name', 'email', 'password' are required`,
                    data: null,
                });
            }

            let encryptedPassword = await bcrypt.hash(password, 10)

            let user = await prisma.user.create({
                data: {
                    first_name,
                    last_name,
                    email,
                    password: encryptedPassword,
                }
            })
            delete user.password

            return res.status(201).json({
                status: true,
                message: 'Registered success',
                data: { user }
            })

        } catch (err) {
            next(err);
        }
    },

    // function update profile users
    updateProfile: async (req, res, next) => {
        try {
            let id = req.params.id;
            let { first_name, last_name, email, address, occupation } = req.body;

            // cek id users
            let existingUsers = await prisma.user.findUnique({
                where: {
                    id: parseInt(id)
                },
            });

            if (!existingUsers) {
                return res.status(404).json({
                    status: false,
                    message: "Users not found",
                    data: null
                });
            }

            // validasi untuk update data
            if (!first_name || !last_name || !email || !address || !occupation) {
                return res.status(400).json({
                    status: false,
                    message: `'field first_name', 'last_name', 'email', 'address', 'occupation' are required`,
                    data: null
                })
            }

            let updateProfile = await prisma.user.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    first_name,
                    last_name,
                    email,
                    address,
                    occupation
                },
            })
            delete updateProfile.password

            return res.status(200).json({
                status: true,
                message: 'Updated successfully',
                data: updateProfile
            })

        } catch (err) {
            next(err);
        }
    },

    // function untuk update avatar
    updateAvatar: async (req, res, next) => {
        try {
            const id = req.params.id;
            const file = req.file; // File yang diunggah oleh Multer
            // console.log(req.file)

            if (!file) {
                return res.status(400).json({
                    status: false,
                    message: 'No file uploaded',
                    data: null
                });
            }

            // handle imagekit

            const stringFile = file.buffer.toString('base64');

            const uploadFile = await imagekit.upload({
                fileName: Date.now() + path.extname(file.originalname),
                file: stringFile
            });

            // Update URL avatar di database menggunakan Prisma
            const updatedUser = await prisma.user.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    avatar_url: uploadFile.url
                },
            });

            return res.status(200).json({
                status: true,
                message: 'Avatar updated successfully',
                data: {
                    name: uploadFile.name,
                    url: uploadFile.url,
                    type: uploadFile.fileType,
                    user: updatedUser
                }
            });

        } catch (err) {
            next(err);
        }
    }
}