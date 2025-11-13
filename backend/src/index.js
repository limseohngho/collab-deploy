// src/index.js
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const projectMemberRoutes = require('./routes/projectMemberRoutes');
const taskRoutes = require('./routes/taskRoutes');
const calendarEventRoutes = require('./routes/calendarEventRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

// 미들웨어
app.use(express.json());
app.use(cors());

// 라우터
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/project-members', projectMemberRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/events', calendarEventRoutes);
app.use('/api/messages', messageRoutes);

// 소켓 통신
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('send_message', (data) => {
    io.emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// 서버 실행
const PORT = process.env.PORT || 5000;   // ★ 배포 필수 코드
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
