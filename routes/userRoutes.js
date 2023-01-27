const express = require("express") ;
const router = express.Router()
const usersController = require('../controllers/usersController')
const {verifyJWTAdmin, verifyJWT} = require('../middleware/verifyJWT')


router.route('/')
    .get(verifyJWTAdmin,usersController.getAllUsers)
    .post(usersController.createNewUser)
    .patch(usersController.updateUser)
    .delete(verifyJWTAdmin,usersController.deleteUser)

module.exports = router
