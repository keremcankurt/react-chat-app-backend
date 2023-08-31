const express = require('express')
const { registerUser, authUser, allUsers } = require('../controllers/userControllers')
const { protect } = require('../middleware/authMiddleware')
const profileImageUpload = require('../middleware/imageUpload')
const router = express.Router()

router.route('/').post(profileImageUpload.single("profile_image"),registerUser).get(protect, allUsers)
router.post('/login', authUser)

module.exports = router