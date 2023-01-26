const express = require("express") ;
const router = express.Router()
const nftController = require('../controllers/nftController')



router.route('/:id')
    .get(nftController.getMyNFTs)
    
    




module.exports = router