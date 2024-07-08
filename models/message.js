const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    channelId: {
        required: true,
        type: String
    },
    content: {
        required: false,
        type: String
    },
    attachment: {
        required: false,
        type: String
    },
    postState: {
        required: true,
        type: Boolean,
        default : false
    },
    trustState: {
        required: true,
        type: Boolean,
        default : true
    },
    serverId: {
        required: false,
        type: String
    },
    messageId : {
        required : true,
        type : String,
        unique: true // Đảm bảo messageId là duy nhất
    }
},{ timestamps: true })

module.exports = mongoose.model('Message', dataSchema)