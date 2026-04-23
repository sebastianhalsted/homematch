# HomeMatch Backend Setup Guide 🚀

This guide helps you set up a real backend server for HomeMatch with actual messaging, user authentication, and apartment management.

## What You'll Build

✅ User authentication (sign up/login)
✅ Real-time messaging between users
✅ Save apartments to database
✅ Upload and manage listings
✅ User profiles

## Prerequisites

- Node.js (v16+) - Download from https://nodejs.org/
- npm (comes with Node.js)
- A code editor (VS Code)

## Step 1: Create Backend Project

```bash
# Create a new folder for backend
mkdir homematch-backend
cd homematch-backend

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express socket.io cors dotenv mongoose bcryptjs jsonwebtoken
npm install --save-dev nodemon
```

## Step 2: Create .env File

Create file: `.env`

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/homematch
JWT_SECRET=your_secret_key_here_change_this
NODE_ENV=development
```

## Step 3: Create Server File

Create file: `server.js`

```javascript
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "http://localhost:8000",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Store connected users
const users = {};
const rooms = {};

// Socket.io events
io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);

    socket.on('register_user', (userData) => {
        users[socket.id] = {
            id: socket.id,
            name: userData.name,
            email: userData.email,
            ...userData
        };
        console.log('User registered:', userData.name);
    });

    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        if (!rooms[roomId]) {
            rooms[roomId] = [];
        }
        rooms[roomId].push(socket.id);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on('send_message', (data) => {
        const { roomId, message, sender } = data;
        io.to(roomId).emit('receive_message', {
            sender,
            message,
            timestamp: new Date(),
            senderId: socket.id
        });
        console.log(`Message in ${roomId}:`, message);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        delete users[socket.id];
    });
});

// REST API Routes

// Get all users
app.get('/api/users', (req, res) => {
    res.json(Object.values(users));
});

// Get active rooms
app.get('/api/rooms', (req, res) => {
    res.json(rooms);
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running' });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

## Step 4: Update package.json

Add to `scripts` section:

```json
"scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
}
```

## Step 5: Connect Frontend to Backend

In your `script.js`, add Socket.io connection:

```javascript
// At the top of script.js
const socket = io('http://localhost:5000');

// Register user
socket.emit('register_user', {
    name: state.userProfile.name,
    email: 'user@example.com'
});

// Join messaging room
function joinMessageRoom(apartmentId) {
    socket.emit('join_room', `apt-${apartmentId}`);
}

// Send real message
function sendRealMessage(apartmentId, message) {
    socket.emit('send_message', {
        roomId: `apt-${apartmentId}`,
        message: message,
        sender: state.userProfile.name
    });
}

// Receive messages
socket.on('receive_message', (data) => {
    console.log('Message received:', data);
    // Update UI with real message
});
```

## Step 6: Run the Server

```bash
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:5000
```

## Step 7: Connect Frontend

1. Open your `index.html` in a browser (keep it on http://localhost:8000)
2. The frontend will connect to the backend automatically
3. Messages are now real-time!

## Database Setup (Optional - For Persistence)

### Install MongoDB

**Windows:**
1. Download from https://www.mongodb.com/try/download/community
2. Run installer
3. MongoDB will run as a service

**Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

### Create Database Models

Create file: `models/User.js`

```javascript
const userSchema = {
    email: String,
    password: String,
    name: String,
    age: Number,
    bio: String,
    profileImage: String,
    createdAt: Date
};
```

Create file: `models/Apartment.js`

```javascript
const apartmentSchema = {
    title: String,
    price: Number,
    size: Number,
    location: String,
    bedrooms: Number,
    bathrooms: Number,
    furnished: Boolean,
    images: [String],
    description: String,
    amenities: [String],
    ownerId: String,
    createdAt: Date
};
```

Create file: `models/Message.js`

```javascript
const messageSchema = {
    roomId: String,
    senderId: String,
    senderName: String,
    message: String,
    timestamp: Date,
    read: Boolean
};
```

## Testing the Backend

Use Postman or cURL:

```bash
# Test health check
curl http://localhost:5000/api/health

# Get connected users
curl http://localhost:5000/api/users

# Get rooms
curl http://localhost:5000/api/rooms
```

## Frontend Changes Needed

### 1. Update `data.js` - Add user field to apartments

```javascript
apartments = [
    {
        id: '1',
        ownerId: 'user_123',
        ownerName: 'John Doe',
        ownerEmail: 'john@example.com',
        ownerPhone: '+45 40 80 60 20',
        // ... rest of apartment data
    }
];
```

### 2. Update messaging to use backend

In `script.js`, replace the mock chat with real messaging:

```javascript
function openChat(aptId) {
    state.currentChatRoom = aptId;
    joinMessageRoom(aptId);
    
    // Listen for real messages
    socket.on('receive_message', (data) => {
        displayMessage(data);
    });
}
```

## Deployment

### Deploy Backend to Heroku

```bash
# Login to Heroku
heroku login

# Create new app
heroku create your-app-name

# Push code
git push heroku main

# View logs
heroku logs --tail
```

### Deploy Frontend

Use GitHub Pages, Netlify, or Vercel:

```bash
# Example: GitHub Pages
# Push frontend to GitHub repository
# Enable GitHub Pages in settings
```

## Security Checklist

- ✅ Use HTTPS in production
- ✅ Hash passwords with bcryptjs
- ✅ Use JWT tokens for authentication
- ✅ Validate all input
- ✅ Set CORS properly
- ✅ Use environment variables for secrets
- ✅ Rate limit API endpoints
- ✅ Sanitize user input

## Common Issues

### "Cannot find module 'express'"
```bash
npm install express
```

### "Port 5000 already in use"
```bash
# Use different port
PORT=5001 npm run dev
```

### "CORS errors in browser"
Make sure your CORS settings match your frontend URL

### "Connection refused"
- Is the server running? (`npm run dev`)
- Is it on the right port? (5000)
- Is frontend connecting to right URL?

## Next Steps

1. Add user authentication (login/signup)
2. Add apartment upload form
3. Add image upload to server
4. Add database persistence
5. Add notifications
6. Add ratings/reviews

## Useful Resources

- Express: https://expressjs.com/
- Socket.io: https://socket.io/
- MongoDB: https://docs.mongodb.com/
- Node.js: https://nodejs.org/en/docs/

---

Need help? Check server logs with `npm run dev`

Version 1.0 | April 2026
