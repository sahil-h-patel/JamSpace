import { Server, Socket } from "socket.io";
import { redisClient } from "../redis";
import type { JoinSessionPayload } from "../models";

export function registerSessionHandlers(io: Server, socket: Socket, ) {
    socket.on('C:host-create-room', async () => {
        const roomCode = Math.floor(100000 + Math.random() * 900000).toString();
        const key = `room:${roomCode}`;
        // join the room to broadcast to screen
        socket.join(roomCode);
        
        await redisClient.set(key, socket.id, { EX: 86400 });
        console.log(`Host ${socket.id} created room: ${roomCode} (Redis)`);
        socket.emit('S:session-created', roomCode);
    })
    socket.on('C:join-room', async (payload: JoinSessionPayload) => {
        const {roomCode, name} = payload;
        const roomKey = `room:${roomCode}`
        const hostSocketId = await redisClient.get(roomKey);

        if (hostSocketId) {
            // room exists; join the room
            socket.join(roomCode)
            
            // create playerId and set it in redis
            const playerId = `player:${socket.id}`
            const playerData = { ...payload, id: socket.id, role: 'player' };
            await redisClient.set(playerId, JSON.stringify(playerData), { EX: 86400 });
            console.log(`Player joined: ${playerId} `)

            const rosterKey = `room:${roomCode}:roster`;
            await redisClient.sAdd(rosterKey, socket.id);
            await redisClient.expire(rosterKey, 86400); // Set expiry to match
            const allPlayerIds = await redisClient.sMembers(rosterKey);

            const currentPlayers = [];
            for (const id of allPlayerIds) {
                const data = await redisClient.get(`player:${id}`);
                if (data) {
                    currentPlayers.push(JSON.parse(data));
                }
            }
            // emit to client and to host that the player joined
            socket.emit('S:join-success', { 
                roomCode, 
                currentPlayers 
            });

            io.to(roomCode).emit('S:player-joined', { 
                id: socket.id, // Useful for React keys
                name, 
                role: 'player'
            });
        } 
        else {
            socket.emit('S:join-error', 'Room not found or expired.');
        }
    })
    socket.on('disconnect', async () => {
        // 1. Find the player's data to know which room they were in
        const playerId = `player:${socket.id}`;
        const dataString = await redisClient.get(playerId);

        if (dataString) {
            const data = JSON.parse(dataString);
            const { roomCode } = data;

            // 2. Remove them from the Roster
            await redisClient.sRem(`room:${roomCode}:roster`, socket.id);
            
            // 3. Delete their individual data
            await redisClient.del(playerId);

            // 4. Tell the room they left (Optional but recommended)
            socket.to(roomCode).emit('S:player-left', { playerId: socket.id });
            
            console.log(`Player ${socket.id} left room ${roomCode}`);
        }
    });
}