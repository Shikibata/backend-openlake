const mongoose = require('mongoose');


const profileSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },   
    balance: {
        type: Number,
        default: 0,
    }

})



module.exports = mongoose.model('Profile', profileSchema)