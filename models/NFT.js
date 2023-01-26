const mongoose = require('mongoose');


const nftSchema = new mongoose.Schema({
    creator: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },   
    image: {
        type: String,
        required: true
    },
    profile_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: 'Profile'
    },
    created_date: {
        type: Date,
        required: true
    }

})



module.exports = mongoose.model('NFT', nftSchema)