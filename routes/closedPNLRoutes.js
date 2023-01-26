const express = require("express") ;
const router = express.Router()
const tradeController = require('../controllers/tradeController')



router.route('/')
    .get(tradeController.getAllClosedTrades)
    



module.exports = router