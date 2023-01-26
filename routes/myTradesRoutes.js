const express = require("express") ;
const router = express.Router()
const tradeController = require('../controllers/tradeController')



router.route('/:id')
    .get(tradeController.getMyTrades)
    



module.exports = router