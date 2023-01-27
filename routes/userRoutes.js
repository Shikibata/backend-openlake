const express = require("express") ;
const router = express.Router()
const usersController = require('../controllers/usersController')
const {verifyJWTAdmin, verifyJWT} = require('../middleware/verifyJWT')

router.use(verifyJWTAdmin)

router.route('/')
    .get(usersController.getAllUsers)
    .post(usersController.createNewUser)
    .patch(usersController.updateUser)
    .delete(usersController.deleteUser)

module.exports = router