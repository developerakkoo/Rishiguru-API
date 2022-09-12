const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    room: {
        type: Schema.Types.ObjectId,
        ref: "Room"
    },

    user:{
        type: Schema.Types.ObjectId,
        refPath: "Type",
        required: true
    },

    Type:{
        type: String,
        required: true,
        enum: ['Astrologer', 'User']
    },

    msg:{
        type: String,
        required: [true, 'msg is required.']
    },

    status:{
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);