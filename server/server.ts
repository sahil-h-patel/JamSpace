import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { registerMusicHandlers } from './src/handlers/music';
import { registerSessionHandlers } from './src/handlers/session';

const PORT =  3001;

const allowedOrigins = [
  "http://localhost:5173", 
  "http://127.0.0.1:5173",
  "jamspace.up.railway.app"
].filter(Boolean) as string[];

const app = express();
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST']
    }
})

io.on('connection', (socket) => {
    registerMusicHandlers(io, socket)
    registerSessionHandlers(io, socket)
})

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Accepting connections from: ${allowedOrigins.join(', ')}`);
});
