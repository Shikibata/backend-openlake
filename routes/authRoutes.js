const express = require("express") ;
const router = express.Router()
const authController = require('../controllers/authController')
const loginLimiter = require('../middleware/loginLimiter')
const {verifyJWT} = require('../middleware/verifyJWT')



router.route('/')
    .post(loginLimiter, authController.login)
    

router.route('/refresh')
    .get(verifyJWT, authController.refresh)

router.route('/logout')
    .post(verifyJWT, authController.logout)

module.exports = router