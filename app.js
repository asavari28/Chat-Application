// const express = require('express');
// const app = express();
// const server = require('http').createServer(app);
// const io = require('socket.io')(server);

// app.use(express.static('public'));

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });

// const users = {};

// io.on('connection', (socket) => {
//     socket.on('new-user', (name) => {
//         users[socket.id] = { name: name, id: socket.id, recipient: null };
//         io.emit('user-list', Object.values(users));
//       });      

//   socket.on('select-recipient', (recipientId) => {
//     users[socket.id].recipient = recipientId;
//     if (users[recipientId]) {
//         socket.emit('selected-recipient', users[recipientId]);
//       }      
//         });

//   socket.on('send-chat-message', (message) => {
//     const recipientId = users[socket.id].recipient;
//     if (recipientId) {
//       socket.to(recipientId).emit('chat-message', { message: message, name: users[socket.id].name });
//     }
//   });

//   socket.on('disconnect', () => {
//     delete users[socket.id];
//     io.emit('user-list', Object.values(users));
//   });
// });

// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./public/utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./public/utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));

const botName = "Worqhat Chat";

// Run krega jb client connect hoga
io.on("connection", (socket) => {
//   console.log(io.of("/").adapter);
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit("message", formatMessage(botName, "Welcome to Worqhat Chat!"));

    // Broadcast krega jb naya user aayega
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // usera nd gropu ki info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listens chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // Runs krega jb user discoonect hoga
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // user and gropu ki info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

// const PORT = process.env.PORT || 3000;

// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

///Group Chat

// const express = require('express');
// const app = express();
// const server = require('http').createServer(app);
// const io = require('socket.io')(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const users = {};

io.on('connection', (socket) => {
    socket.on('new-user', (name) => {
        users[socket.id] = { name: name, id: socket.id, recipient: null };
        io.emit('user-list', Object.values(users));
      });      

  socket.on('select-recipient', (recipientId) => {
    users[socket.id].recipient = recipientId;
    if (users[recipientId]) {
        socket.emit('selected-recipient', users[recipientId]);
      }      
        });

  socket.on('send-chat-message', (message) => {
    const recipientId = users[socket.id].recipient;
    if (recipientId) {
      socket.to(recipientId).emit('chat-message', { message: message, name: users[socket.id].name });
    }
  });

  socket.on('disconnect', () => {
    delete users[socket.id];
    io.emit('user-list', Object.values(users));
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});