const mongoose = require('mongoose');


const wireSchema = new mongoose.Schema({
    profile_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Profile'
    },
    amount: {
        type: Number,
        required: true,
    },
    withdrawal: {
        type: Boolean,
        required: true
    }
    

})



module.exports = mongoose.model('Wire', wireSchema)