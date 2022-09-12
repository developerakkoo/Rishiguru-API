const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const rechargeSchema = new Schema({
    userId:{
        type: String,
        required: [true, 'UserId is Required!']
    },

    amount:{
        type: Number,
        required:[true, 'Amount of recharge is Required!']
    },

    status:{
        type: Boolean,
        required: [true, 'Status of recharge Required!']
    }
},{
    timestamps: true
});


module.exports = mongoose.model('Recharge', rechargeSchema);
