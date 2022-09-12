const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const roomSchema = new Schema({
    name: {
        type: String,
       
    },

    topic: String,
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        refPath: "Type",
        required: true

    }
    ],

    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message'
        }
    ],

    Type:{
        type: String,
        required: true,
        enum: ['Astrologer', 'User']
    },

}, {
    timestamps: true
})


module.exports = mongoose.model("Room", roomSchema);

