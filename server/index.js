// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const userRoutes = require('./routes/userRoutes');
// const messageRoutes = require('./routes/messageRoutes');
// const socketIo = require('socket.io');

// const app = express();
// require('dotenv').config();

// app.use(cors({
//   origin: 'http://localhost:3000', // Permitir solicitudes desde este origen
//   credentials: true, // Permitir credenciales (cookies, encabezados de autorización, etc.)
// }));
// app.use(express.json());

// app.use('/api/auth', userRoutes);
// app.use('/api/messages', messageRoutes);

// const PORT = process.env.PORT || 5000;
// const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1/chats';

// mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     console.log("DB CONNECTION SUCCESSFUL");
//     if (process.env.NODE_ENV !== 'test') {
//       app.listen(PORT, () => {
//         console.log(`Server started on ${PORT}`);
//       });
//     }
//   })
//   .catch(err => {
//     console.error('Connection error', err);
//   });

// const io = socketIo(server, {
//   cors: {
//     origin: 'http://localhost:3000', // Permitir solicitudes desde este origen
//     credentials: true, // Permitir credenciales (cookies, encabezados de autorización, etc.)
//   },
// });

// global.onlineUsers = new Map();

// io.on("connection", (socket) => {
//   global.chatSocket = socket;
//   socket.on('add-user', (userId) => {
//     onlineUsers.set(userId, socket.id);
//   });

//   socket.on('send-msg', (data) => {
//     const sendUserSocket = onlineUsers.get(data.to);
//     if (sendUserSocket) {
//       socket.to(sendUserSocket).emit('msg-recieve', data.message); // Asegúrate de que se use correctamente data.message aquí
//     }
//   });
// });

// module.exports = app;

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const socketIo = require('socket.io');

const app = express();
require('dotenv').config();

app.use(cors({
  origin: 'http://localhost:3000', // Permitir solicitudes desde este origen
  credentials: true, // Permitir credenciales (cookies, encabezados de autorización, etc.)
}));
app.use(express.json());

app.use('/api/auth', userRoutes);
app.use('/api/messages', messageRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1/chats';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("DB CONNECTION SUCCESSFUL");
    if (process.env.NODE_ENV !== 'test') {
      const server = app.listen(PORT, () => {
        console.log(`Server started on ${PORT}`);
      });

      const io = socketIo(server, {
        cors: {
          origin: 'http://localhost:3000', // Permitir solicitudes desde este origen
          credentials: true, // Permitir credenciales (cookies, encabezados de autorización, etc.)
        },
      });

      global.onlineUsers = new Map();

      io.on("connection", (socket) => {
        global.chatSocket = socket;
        socket.on('add-user', (userId) => {
          onlineUsers.set(userId, socket.id);
        });

        socket.on('send-msg', (data) => {
          const sendUserSocket = onlineUsers.get(data.to);
          if (sendUserSocket) {
            socket.to(sendUserSocket).emit('msg-recieve', data.message); // Asegúrate de que se use correctamente data.message aquí
          }
        });
      });
    }
  })
  .catch(err => {
    console.error('Connection error', err);
  });

module.exports = app; // Exporta la aplicación Express
