const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
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
        }
    }
);

module.exports = mongoose.model('User', userSchema)