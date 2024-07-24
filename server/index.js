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

const uri = "mongodb://localhost:27017/chats";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("DB CONNECTION SUCCESSFUL");
}).catch((err) => {
  console.log(err.message);
});

const server = app.listen(process.env.PORT, () => {
  console.log(`Server started on ${process.env.PORT}`);
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
