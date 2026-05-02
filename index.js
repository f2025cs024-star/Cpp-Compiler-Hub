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

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret === 'secret') {
        console.error('FATAL: Set a strong JWT_SECRET in production (not the default).');
        process.exit(1);
    }
}

const db = require('./models/db');
const socketHandlers = require('./socket/handlers');

const app = express();
app.disable('x-powered-by');
// Render and other reverse proxies send X-Forwarded-For; required for express-rate-limit v8+
app.set('trust proxy', 1);

/** Comma-separated list, e.g. https://your-app.onrender.com — limits who can call API / sockets from browsers */
const corsOrigins = (process.env.CORS_ORIGIN || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

const corsOptions =
    corsOrigins.length > 0
        ? { origin: corsOrigins, methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'] }
        : isProd
          ? { origin: false, methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'] }
          : {};

if (isProd && corsOrigins.length === 0) {
    console.warn(
        'SECURITY: CORS_ORIGIN is unset — only same-origin browser access is allowed. Set CORS_ORIGIN to your HTTPS URL(s) if you need another origin.'
    );
}

const server = http.createServer(app);
const io = new Server(server, {
    cors:
        corsOrigins.length > 0
            ? { origin: corsOrigins, methods: ['GET', 'POST'] }
            : isProd
              ? { origin: false, methods: ['GET', 'POST'] }
              : { origin: '*', methods: ['GET', 'POST'] },
});

// Middleware
app.use(
    helmet({
        contentSecurityPolicy: false, // Monaco / inline bootstrap need relaxed CSP; tighten in a custom build if needed
        crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
        strictTransportSecurity: isProd
            ? { maxAge: 15552000, includeSubDomains: true, preload: false }
            : false,
    })
);
app.use(cors(corsOptions));
app.use(express.json({ limit: process.env.JSON_BODY_LIMIT || '256kb' }));
app.use(isProd ? morgan('combined') : morgan('dev'));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: Number(process.env.API_RATE_LIMIT_MAX) || 100,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);

// Static files
const distPath = path.join(__dirname, './client/dist');
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

const PORT = process.env.PORT || 7860;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 NexCPP Server running on port ${PORT}`);
});
