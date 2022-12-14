require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoute');
const roomRoutes = require('./routes/roomRoutes');
const http = require('http');
const httpServer = http.createServer(app);
const socket = require('socket.io');

const io = socket(httpServer, {
    cors: {
        origin: 'http://localhost:3000',
        credentials: true,
    },
});
const checkToken = require('./socket.io/socketMiddleware/checkToken');
const onConnection = require('./socket.io/socketConnection');

io.use(checkToken);
io.on('connection', onConnection);

app.use(cors());
app.use(express.json());
app.use('/api/auth', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/rooms', roomRoutes);
mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('DB Connection Successfully!'))
    .catch((err) => console.log(err.message));

httpServer.listen(process.env.PORT, () => {
    console.log(`Server running on PORT ${process.env.PORT}!`);
});
