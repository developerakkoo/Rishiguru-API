const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: {
        type: String,
        required: [true, 'A title is required for this.']
    },

    imageUrl:{
        type: String,
        required: [true, 'A image URL is required for this.']
    },

    body:{
        type: String,
        required: [true, 'A description is required for this.']
    },

    author:{
        type: String,
        required:[true, 'A author is required for this.']
    },

    tag:{
        type: String,
        required: [true, 'A tag is required for this.']
    },

}, {
    timestamps: true
})


module.exports = mongoose.model('Blog', blogSchema);
