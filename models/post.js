const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const postSchema = new Schema(
    {
        userName:
        {
            required: true,
            type: String
        },
        TwitchId:
        {
            required: true,
            type: String
        },
        status:
        {
            type: String,
        }
       
    },
    {timestamps: true}
);

module.exports = mongoose.model('Post', postSchema)