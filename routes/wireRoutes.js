const express = require("express") ;
const router = express.Router()
const wireController = require('../controllers/wireController')
const {verifyJWT} = require('../middleware/verifyJWT')


router.use(verifyJWT)


router.route('/')
    .post(wireController.newWire)
    



module.exports = router