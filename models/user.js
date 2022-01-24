const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        TwitchId:
        {
            required: true,
            type: String
        }
    }
);

module.exports = mongoose.model('User', userSchema)