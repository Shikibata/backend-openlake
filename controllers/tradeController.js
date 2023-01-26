const asyncHandler = require('express-async-handler')
const Profile = require('../models/Profile')
const Trade = require('../models/Trade')
const NFT = require('../models/NFT')
const jwt_decode = require("jwt-decode")

//opening trade POST /openTrade

const create = asyncHandler(async (req,res) => {
    const {nftBuy, profile_id}  = req.body
    
    console.log(req.body)
    
    if(!nftBuy || !profile_id){
        return res.status(400).json({ message: 'Profile ID, NFT required.'})
    }

    const profile = await Profile.findOne({'_id': profile_id }).exec()
    const boughtNFT = await NFT.findOne({"_id": nftBuy}).exec()

    if(boughtNFT.profile_id) {
        return res.status(400).json({ message: 'Item not available, please choose another.'})
    }

    if(profile.balance < boughtNFT.price) {
        return res.status(400).json({ message: 'Insufficient balance.'})
    }

    if(profile.balance > boughtNFT.price) {
        //create trade for the profile with the nft
        const open_datetime = new Date()
        const newTradeObject = {"nft_id": boughtNFT._id, profile_id, "open_price": boughtNFT.price, open_datetime, "nft_title": boughtNFT.title }

        const newTrade = await Trade.create(newTradeObject)

        //remove NFT price from balance

        const newBalance = profile.balance - boughtNFT.price

        profile.balance = newBalance

        const updatedBalance = await profile.save()

        //put profile_id in nft to register it for user

        boughtNFT.profile_id = profile._id

        await boughtNFT.save()

        //answer

        return res.json({ message: `Successfully bought ${boughtNFT.title} for ${boughtNFT.price} ETH. ${newBalance} ETH remaining.`})
    }


})

//closing trade POST /closeTrade

const close = asyncHandler(async (req,res) => {
    const {nftSell, profile_id} = req.body 

    if(!nftSell || !profile_id){
        return res.status(400).json({ message: 'Trade ID required.'})
    }

    
    const profile = await Profile.findOne({'_id': profile_id }).exec()
    const boughtNFT = await NFT.findOne({"_id": nftSell}).exec()
    const trade = await Trade.findOne({'profile_id': profile_id, "nft_id": nftSell }).exec()

    
    trade.open = false
    trade.close_price = boughtNFT.price
    const close_datetime = new Date()
    trade.close_datetime = close_datetime

    await trade.save()
    //return NFT with empty owner, to be changed if bought by someone specific
    boughtNFT.profile_id = null

    await boughtNFT.save()
     //update balance

    const newBalance = profile.balance + boughtNFT.price

    profile.balance = newBalance

    await profile.save()

    
    return res.json({ message: `Successfully sold ${boughtNFT.title} for ${boughtNFT.price} ETH. ${newBalance} ETH remaining.`})

})

//get all my trades GET /trades/index
const getMyTrades = asyncHandler(async (req,res) => {
    const  id  = req.params.id
    const myTrades = await Trade.find({"profile_id": id}).exec()
    
    res.json(myTrades)
})

//get data about one trade GET /trades/:id

const getTrade = asyncHandler(async (req,res) => {
    const { id } = req.body
    const myTrade = await Trade.findById(id).exec()
    if(!myTrade?.length){
        return res.status(400).json({message: 'No trade found'})
    }
    res.json(myTrade)
})

//get all of user open trades /trades/index/open

const getMyOpenTrades = asyncHandler(async (req,res) => {
    const  id  = req.params.id
    const myTrades = await Trade.find({"profile_id": id, "open": true}).exec()
    if(!myTrades?.length){
        return res.status(400).json({message: 'No trade found'})
    }
    res.json(myTrades)
})

//get all of user closed trades /trades/index/open

const getMyClosedTrades = asyncHandler(async (req,res) => {
    const { id } = req.body
    const myTrades = await Trade.find({"profile_id": id, "open": false}).exec()
    if(!myTrades?.length){
        return res.status(400).json({message: 'No trade found'})
    }
    res.json(myTrades)
})

//get all open trades GET /openPNL
const getAllOpenTrades = asyncHandler(async (req,res) => {
    const trades = await Trade.find({"open": true}).exec()
    if(!trades?.length){
        return res.status(400).json({message: 'No trade found'})
    }
    res.json(trades)
})

//get all closed trades GET /closedPNL
const getAllClosedTrades = asyncHandler(async (req,res) => {
    const trades = await Trade.find({"open": false}).exec()
    if(!trades?.length){
        return res.status(400).json({message: 'No trade found'})
    }
    res.json(trades)
})



module.exports = {
    create,
    close,
    getMyTrades,
    getTrade,
    getMyOpenTrades,
    getMyClosedTrades,
    getAllOpenTrades,
    getAllClosedTrades
}