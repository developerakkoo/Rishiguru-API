const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type: String,
        required:[true,'Please provide us a name']
    },

    phonenumber:{
        type: Number,
        minValue:[10, 'Please provide a valid number']
    },

    availableBalance:{
        type: Number,   
        default: 0
    }
  
}, {
    timestamps: true,
})

module.exports = mongoose.model('User', userSchema);