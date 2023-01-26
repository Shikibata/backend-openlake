const mongoose = require('mongoose');


const tradeSchema = new mongoose.Schema({
    nft_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'NFT'
    },
    nft_title: {
        type: String,
        required: true, 
    },
    profile_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Profile'
    },
    open_price: {
        type: Number,
        required: true,
    },
    close_price: {
        type: Number,
        default: null
    },
    open_datetime: {
        type: Date,
        required: true,
    },   
    close_datetime:{
        type: Date,
        default: null
    },
    open: {
        type: Boolean,
        default: true
    }

})



module.exports = mongoose.model('Trade', tradeSchema)