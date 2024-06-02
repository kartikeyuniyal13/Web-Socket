const express = require('express');
const { createServer } = require('http');
const { join } = require('path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {}
});

let messages = []; // In-memory store for messages

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle message reception and storage
  socket.on('chat message', (msg) => {
    const messageId = messages.length + 1;
    messages.push({ id: messageId, content: msg });
    io.emit('chat message', msg, messageId);
  });

  // Handle reconnection and send missed messages
  socket.on('reconnect', (lastMessageId) => {
    console.log(`Reconnecting from message ID: ${lastMessageId}`);
    const missedMessages = messages.filter(msg => msg.id > lastMessageId);
    missedMessages.forEach(msg => {
      socket.emit('chat message', msg.content, msg.id);
    });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
