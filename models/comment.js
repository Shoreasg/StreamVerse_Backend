const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const commentSchema = new Schema(
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
        comment:
        {
            required: true,
            type: String,
        },
        profileImage:
        {
            required: true,
            type: String
        },
        statusID:
        {
            required: true,
            type: String
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
    {timestamps: true}
);

module.exports = mongoose.model('Comment', commentSchema)