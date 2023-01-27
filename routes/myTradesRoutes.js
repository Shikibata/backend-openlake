const express = require("express") ;
const router = express.Router()
const tradeController = require('../controllers/tradeController')
const {verifyJWT} = require('../middleware/verifyJWT')

router.use(verifyJWT)



router.route('/:id')
    .get(tradeController.getMyTrades)
    



module.exports = router