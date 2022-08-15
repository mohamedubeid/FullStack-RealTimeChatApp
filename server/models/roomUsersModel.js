const mongoose = require('mongoose');

const roomUsersSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        roomId: mongoose.Schema.Types.ObjectId,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('RoomUsers', roomUsersSchema);
