const express = require("express") ;
const router = express.Router()
const nftController = require('../controllers/nftController')
const {verifyJWT} = require('../middleware/verifyJWT')

router.use(verifyJWT)



router.route('/:id')
    .get(nftController.getMyNFTs)
    
    




module.exports = router