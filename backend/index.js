const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');
const sequelize = require('./config/database');
const itemRoutes = require('./routes/itemRoutes');
const Item = require('./models/Item');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(bodyParser.json());

// Middleware to pass io to routes
app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use('/items', itemRoutes);

sequelize.sync().then(() => console.log("Database connected"));

io.on('connection', (socket) => {
    console.log('User connected', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
    });
});

server.listen(5000, () => console.log('Server running on http://localhost:5000'));
