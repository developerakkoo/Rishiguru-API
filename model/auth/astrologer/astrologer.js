const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AstrologerSchema = new Schema({
  
    email:{
        type: String,
        required: [true, 'Please provide us a email...']
    },

    password:{
        type: String,
        required: [true, 'Please provide us a password...']
    },

    firstname:{
        type: String,
    },
    lastname:{
        type: String,
    },

    experience:{
        type: String,
    },

    imageUrl:{
        type: String,
    },

    mobilenumber:{
    type: Number,
    },

   language: {
       type: String,
   },

   type:{
       type: String,

   },

   rating: {
       type: Number,
   },

   aboutme:{
       type: String
   },

   verificationStatus:{
       type: String,
       default: "unverified"
   },

   activeOnCall:{
       type: Boolean,
       default: false
   },

   activeOnChat:{
       type: Boolean,
       default: false
   },

   activeOnVideo:{
       type: Boolean,
       default: false
   },

   charges:{
       type: Number
   },

   totalConsulations:{
       type: Number,
   }



}, {
    timestamps: true,
})

module.exports = mongoose.model('Astrologer', AstrologerSchema);