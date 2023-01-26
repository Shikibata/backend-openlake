const asyncHandler = require('express-async-handler')
const NFT = require('../models/NFT')


//@desc Get one NFT
//@route GET /explore/:id
//@access Private
const getNFT = asyncHandler(async (req,res) => {
    const id = req.params.id
   
    if(!id){
        return res.status(400).json({message: 'No NFT found.'})
    }
    const singleNFT = await NFT.findById(id).exec()

    res.json(singleNFT)
})

//@desc Get my NFTs
//@route GET /explore/:profile_id
//@access Private
const getMyNFTs = asyncHandler(async (req,res) => {
    const id = req.params.id

    console.log(req.params)
    if(!id){
        return res.status(400).json({message: 'No ID was provided found.'})
    }
    const NFTs = await NFT.find({"profile_id": id}).exec()

    res.json(NFTs)
})

//@desc Get all NFT
//@route GET /explore
//@access Private
const getAllNFTs = asyncHandler(async (req,res) => {
    const NFTs = await NFT.find().lean()
    if(!NFTs?.length){
        return res.status(400).json({message: 'No NFT found.'})
    }
    const fivePopular = await NFT.find().sort({"title": 1}).limit(8).exec()
    const fiveNewest =  await NFT.find().sort({"created_date": -1}).limit(8).exec()


    res.json({NFTs, fiveNewest, fivePopular})
})

//create for test POST
const create = asyncHandler(async (req,res) => {
        const { title, creator, price, image } = req.body
        const date = new Date()

         //Confirm data
    if(!title || !creator || !price ||!image) {
        return res.status(400).json( {message: 'All fields are required.'})
    }

    //Check for duplicate 

    const duplicate = await NFT.findOne({ title }).lean().exec()

    if(duplicate) {
        return res.status(409).json({ message: 'Duplicate NFT' })
    }

    const nftObject = { title, creator, price, image, "created_date": date }

    const createdNFT = await NFT.create(nftObject)

    res.json({message: `${createdNFT.title} created`})
})

const deleteNFT = asyncHandler(async (req,res) => {
    const { title } = req.body
    if(!title ) {
        return res.status(400).json( {message: 'All fields are required.'})
    }

    const deletedNFT= await NFT.findOne({title}).exec()

    await deletedNFT.remove()
    const reply = `NFT ${deletedNFT.title} deleted`

    res.json(reply)

})

//@desc Get NFTs by search
//@route GET /explore/search/:id
//@access Private

const findBySearch = asyncHandler(async (req,res) => {
    const search  = req.params.search

    console.log(req.params.search)
    if(!search ) {
        return res.status(400).json( {message: 'No search info was provided.'})
    }

    const foundNFTs= await NFT.find({$or: [{"creator": { $regex: search, '$options': 'i' }}, {"title": { $regex: search, '$options': 'i' }}]}).exec()

    res.json(foundNFTs)

})

module.exports = {
    create, 
    getAllNFTs,
    getNFT,
    deleteNFT,
    getMyNFTs,
    findBySearch
}

//delete DELETE

