const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

const db = require('./models/db');
const socketHandlers = require('./socket/handlers');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(helmet({
    contentSecurityPolicy: false, // For development ease with Monaco
}));
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Static files
const distPath = path.join(__dirname, '../client/dist');
app.use(express.static(distPath));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/programs', require('./routes/programs'));
app.use('/api/users', require('./routes/users'));

// Catch-all route to serve the frontend (SPA)
app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
});

// Socket.IO connection
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    socketHandlers(io, socket);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 NexCPP Server running on port ${PORT}`);
});
