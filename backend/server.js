require('dotenv').config();                           // 1
const express = require('express');                   // 2
const http = require('http');                         // 3
const { Server } = require('socket.io');              // 4
const mongoose = require('mongoose');                 // 5
const cors = require('cors');                         // 6

const authRoutes = require('./routes/auth');          // 7
const messageRoutes = require('./routes/messages');   // 8
const Message = require('./models/Message');          // 9
const jwt = require('jsonwebtoken');                  // 10

const app = express();                                // 11
const server = http.createServer(app);                // 12
const io = new Server(server, {                       // 13
  cors: { origin: "http://localhost:3000", credentials: true } // 14
});

app.use(cors());                                      // 15
app.use(express.json());                              // 16

app.use('/api/auth', authRoutes);                     // 17
app.use('/api/messages', messageRoutes);              // 18

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)               // 19
  .then(() => console.log('✅ MongoDB connected'))    // 20
  .catch((err) => console.error(err));                // 21

// Socket auth middleware (handshake)
io.use((socket, next) => {                            // 22
  const token = socket.handshake.auth?.token;        // 23
  if (!token) return next(new Error('No token'));    // 24
  try {                                               // 25
    const payload = jwt.verify(token, process.env.JWT_SECRET); // 26
    socket.user = { username: payload.username };     // 27
    next();                                           // 28
  } catch (err) {                                     // 29
    next(new Error('Invalid token'));                 // 30
  }                                                   // 31
});

// Socket events
io.on('connection', async (socket) => {               // 32
  console.log('🔌', socket.user.username, 'connected'); // 33

  // Send recent history on connect
  const msgs = await Message.find().sort({ timestamp: 1 }).limit(50); // 34
  socket.emit('chat history', msgs);                  // 35

  // Receive message
  socket.on('chat message', async (text) => {         // 36
    const newMsg = new Message({ sender: socket.user.username, text }); // 37
    await newMsg.save();                              // 38
    io.emit('chat message', newMsg);                  // 39
  });

  socket.on('disconnect', () => {                     // 40
    console.log('❌', socket.user.username, 'disconnected'); // 41
  });
});

// Start server
const PORT = process.env.PORT || 5000;                // 42
server.listen(PORT, () => console.log(`🚀 Server on ${PORT}`)); // 43
