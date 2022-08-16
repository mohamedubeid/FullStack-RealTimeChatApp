const mongoose = require('mongoose');

const roomUsersSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Rooms' },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('RoomUsers', roomUsersSchema);
