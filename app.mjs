import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();

const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = new SocketIOServer(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(__dirname))

app.get('/api/socket', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        console.log(socket.username + ' messaged:', msg.id + "" + msg.message);
    
        // Broadcast the message to all connected clients
        io.emit('chat message', msg);
    });
      
    socket.on("set username", (username) => {
        socket.username = username;
        io.emit("user connected", username + " has connected");
        console.log(username + " connected");
    });
    socket.on('disconnect', () => {
        io.emit("user disconnected", socket.username + " has disconnected")
        console.log(socket.username+" disconnected")
    })
});

server.listen(port, () => {
    console.log("Listening on localhost:3000/");
})