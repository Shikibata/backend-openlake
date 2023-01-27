const express = require("express") ;
const router = express.Router()
const nftController = require('../controllers/nftController')
const {verifyJWT} = require('../middleware/verifyJWT')




router.route('/')
    .get(nftController.getAllNFTs)
    .post(verifyJWT, nftController.create)
    .delete(verifyJWT, nftController.deleteNFT)
    

router.route('/:id')
    .get(nftController.getNFT)

router.route('/search/:search')
    .get(nftController.findBySearch)



module.exports = router