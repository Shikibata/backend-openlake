const express = require("express") ;
const router = express.Router()
const tradeController = require('../controllers/tradeController')



router.route('/')
    .post(tradeController.close)
    



module.exports = router