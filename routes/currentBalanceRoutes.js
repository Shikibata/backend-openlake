const express = require("express") ;
const router = express.Router()
const wireController = require('../controllers/wireController')



router.route('/')
    .post(wireController.getBalance)
    



module.exports = router