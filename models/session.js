const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionSchema = new Schema(
    {
        _id: {
            type: String,
            required: true
        },
        twitchId:{
            required: true,
            unique: true,
            type: String
        }
    });

module.exports = mongoose.model('Sessions', sessionSchema)