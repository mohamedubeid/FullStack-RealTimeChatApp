const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
    {
        room: {
            type: String,
            required: true,
            unique: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Rooms', roomSchema);
