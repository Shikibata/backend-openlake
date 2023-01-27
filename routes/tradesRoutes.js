const express = require("express") ;
const router = express.Router()
const tradeController = require('../controllers/tradeController')
const {verifyJWT} = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/index')
    .get(tradeController.getMyTrades)

router.route(`/:id`)
    .get(tradeController.getTrade)

router.route('/index/open')
    .get(tradeController.getMyOpenTrades)

router.route('/index/closed')
    .get(tradeController.getMyClosedTrades)
    



module.exports = router