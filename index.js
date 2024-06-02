const express = require('express');
const { createServer } = require('http');
const { join } = require('path');
const { Server } = require('socket.io');
const { MongoClient } = require('mongodb');

const app = express();
const server = createServer(app);









const io = new Server(server, {
  connectionStateRecovery: {}
});




async function main() {

  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});


var x=1;



  try {
    // Connect to the MongoDB server
    await client.connect();

    // Select the database
    const db = client.db('chat');

    // Select the collection
    const collection = db.collection('message');

    // Insert a single document
 







io.on('connection', (socket) => {
  console.log('A user connected');


  
  // Handle message reception and storage
  socket.on('chat message',async (msg) => {
    const messageId = x++;
    const result = await collection.insertOne({id:messageId,message:msg});
    console.log(`New document inserted with _id: ${result.messageId}`);
    io.emit('chat message', msg, messageId);
  });

  socket.on('reconnect', async (lastMessageId) => {
    console.log(`Reconnecting from message ID: ${lastMessageId}`);


    const query = { id: { $gt: lastMessageId } };

   
    const missedMessages = await collection.find(query).toArray();
   // const missedMessages = messages.filter(msg => msg.id > lastMessageId);
    missedMessages.forEach(msg => {
      socket.emit('chat message', msg.message, msg.id);
    });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});

   

} catch (e) {
  console.error(e);
} 
}

main().catch(console.error);
