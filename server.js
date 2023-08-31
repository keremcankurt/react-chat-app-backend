const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const colors = require('colors');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

dotenv.config()
connectDB()
const app = express()

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  });

app.use(express.static('public'));
app.use(express.json())

app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)

app.use(notFound)
app.use(errorHandler)
const port = process.env.PORT || 400;
const server = app.listen(
    port,
    console.log(`Server running on PORT ${port}...`.yellow.bold)
);

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: 'http://localhost:3000'
  }
})

io.on('connection', (socket) => {
  console.log('connected to socket.io')
  socket.on('setup', (userData) => {
    socket.join(userData._id)
    socket.emit('connected')
  })

  socket.on('join chat',(room) => {
    socket.join(room);
    console.log('User joined room: ' + room)
  })
  socket.on('typing',(room) => {
    socket.in(room).emit('typing')
  })
  socket.on('stop typing',(room) => {
    socket.in(room).emit('stop typing')
  })
  socket.on('new message',(newMessageReceived) => {
    var chat = newMessageReceived.chat;
    if(!chat.users) return console.log('chat.users not defined')

    chat.users.forEach(user => {
      if(user._id == newMessageReceived.sender._id) return;
      socket.in(user._id).emit('message received',newMessageReceived)
    });
  })

  socket.off('setup', () => {
    console.log('USER DISCONNECTED')
    socket.leave(userData._id)
  })
})

