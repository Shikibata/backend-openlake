const express = require("express") ;
const router = express.Router()
const tradeController = require('../controllers/tradeController')
const {verifyJWT} = require('../middleware/verifyJWT')

router.use(verifyJWT)



router.route('/')
    .get(tradeController.getAllOpenTrades)
    



module.exports = router