const express = require('express');
const router = express.Router();
const { register, updateProfile, updateAvatar } = require('../controllers/users.controllers');
const { image } = require('../libs/multer');

router.post('/users/register', register);
router.put('/users/:id', updateProfile);
router.put('/users/:id/avatar', image.single('image'), updateAvatar);
module.exports = router;