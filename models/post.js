const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const postSchema = new Schema(
    {
        userName:
        {
            required: true,
            type: String
        },
        twitchId:
        {
            required: true,
            type: String
        },
        status:
        {
            required: true,
            type: String,
        },
        profileImage:
        {
            required: true,
            type: String
        },
        comment:
        {
            type: [{ type: mongoose.Types.ObjectId, ref: "Comment" }]
        },
        editedOn:
        {
            type: Date
        },
        kappa:
        {
            type:[]
        },
        lul:
        {
            type:[]
        },
        good:
        {
            type:[]
        }



    },
    { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema)