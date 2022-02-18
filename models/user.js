const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        userName:
        {
            required: true,
            unique: true,
            type: String
        },
        twitchId:
        {
            required: true,
            unique: true,
            type: String
        },
        description:
        {
            type: String
        },
        profileImage:
        {
            type: String
        },
        followers:
        {
            type: Array,
            default: []

        },
        followings:
        {
            type: Array,
            default: []
        }

    },{versionKey: false, timestamps: true}
);

module.exports = mongoose.model('User', userSchema)