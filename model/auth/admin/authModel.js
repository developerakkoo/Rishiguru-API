const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  
    email:{
        type: String,
        required: [true, 'Please provide us a email...']
    },

    password:{
        type: String,
        required: [true, 'Please provide us a password...']
    },

    username:{
        type: String,
        required: [true, 'Please provide us a username...']
    }
}, {
    timestamps: true,
})

module.exports = mongoose.model('Admin', AdminSchema);