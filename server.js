// HomeMatch Backend Server - Starter Template
// This is a simple Node.js + Express server with Socket.io for real-time messaging

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Socket.io configuration
const io = socketIO(server, {
    cors: {
        origin: ["http://localhost:8000", "http://localhost:3000"],
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Data storage (in production, use a database)
const users = {};
const rooms = {};
const messages = {};

// Socket.io connection
io.on('connection', (socket) => {
    console.log(`✓ User connected: ${socket.id}`);

    // User registration
    socket.on('register_user', (userData) => {
        users[socket.id] = {
            id: socket.id,
            name: userData.name,
            email: userData.email,
            profile: userData.profile,
            connectedAt: new Date()
        };
        console.log(`✓ User registered: ${userData.name}`);
    });

    // Join messaging room
    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        if (!rooms[roomId]) {
            rooms[roomId] = [];
            messages[roomId] = [];
        }
        rooms[roomId].push(socket.id);
        console.log(`✓ User ${socket.id} joined room ${roomId}`);
        
        // Send chat history
        socket.emit('chat_history', messages[roomId]);
    });

    // Send message
    socket.on('send_message', (data) => {
        const { roomId, message, sender } = data;
        
        const messageObj = {
            sender,
            senderId: socket.id,
            message,
            timestamp: new Date(),
            read: false
        };

        // Store message
        if (!messages[roomId]) {
            messages[roomId] = [];
        }
        messages[roomId].push(messageObj);

        // Broadcast to room
        io.to(roomId).emit('receive_message', messageObj);
        console.log(`💬 Message in ${roomId}: ${message}`);
    });

    // Get room users
    socket.on('get_room_users', (roomId) => {
        const roomUsers = rooms[roomId] ? rooms[roomId].map(userId => users[userId]) : [];
        socket.emit('room_users', roomUsers);
    });

    // Typing indicator
    socket.on('typing', (data) => {
        socket.to(data.roomId).emit('user_typing', {
            userId: socket.id,
            userName: users[socket.id]?.name
        });
    });

    // Stop typing
    socket.on('stop_typing', (data) => {
        socket.to(data.roomId).emit('user_stopped_typing', {
            userId: socket.id
        });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log(`✗ User disconnected: ${socket.id}`);
        delete users[socket.id];
        
        // Remove from all rooms
        Object.keys(rooms).forEach(roomId => {
            rooms[roomId] = rooms[roomId].filter(userId => userId !== socket.id);
        });
    });
});

// REST API Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'Server is running',
        users: Object.keys(users).length,
        rooms: Object.keys(rooms).length,
        timestamp: new Date()
    });
});

// Get all active users
app.get('/api/users', (req, res) => {
    const userList = Object.values(users).map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        connectedAt: user.connectedAt
    }));
    res.json(userList);
});

// Get all active rooms
app.get('/api/rooms', (req, res) => {
    const roomList = Object.keys(rooms).map(roomId => ({
        id: roomId,
        users: rooms[roomId].length,
        messages: messages[roomId] ? messages[roomId].length : 0
    }));
    res.json(roomList);
});

// Get room messages
app.get('/api/rooms/:roomId/messages', (req, res) => {
    const { roomId } = req.params;
    res.json(messages[roomId] || []);
});

// Create or post apartment (would connect to database)
app.post('/api/apartments', (req, res) => {
    const apartment = req.body;
    apartment.id = `apt-${Date.now()}`;
    apartment.createdAt = new Date();
    res.json({
        message: 'Apartment created successfully',
        apartment
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════╗
║   HomeMatch Backend Server         ║
║   Running on http://localhost:${PORT}  ║
╚════════════════════════════════════╝
    `);
});
