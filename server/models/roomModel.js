const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
    {
        room: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Rooms', roomSchema);
