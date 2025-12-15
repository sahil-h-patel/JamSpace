import { Server, Socket } from "socket.io";
import type { Note, PlayPhrasePayload, CreatePhrasePayload } from '../models'
import { redisClient } from "../redis";

export function registerMusicHandlers(io: Server, socket: Socket) {
    socket.on('C:play-phrase', async (payload: PlayPhrasePayload) => {
        const { roomCode, phraseId } = payload 
        const key = `room:${roomCode}`;

        // get hostSocket to emit to it the specific phraseId
        const hostSocketId = await redisClient.get(key);
        if (hostSocketId) {
            io.to(hostSocketId).emit('S:phrase-played', {
                playerId: socket.id,
                phraseId
            });
        }
    })
    // socket.on('C:create-phrase', async (payload: CreatePhrasePayload) => {
    //     const { roomCode, phraseName, notes } = payload;
    //     // use existing for edits otherwise create a new one
    //     const phraseId = payload.phraseId || `phrase:${socket.id}:${Date.now()}`;

    //     // construct new phrase object
    //     const phraseData = {
    //         id: phraseId,
    //         creatorId: socket.id,
    //         name: phraseName,
    //         notes: notes
    //     };
    //     const phrasesKey = `phrases:${roomCode}`;
        
    //     /* phrasesKey -> stores all phrases in a specific room
    //        phraseId   -> id for the specific phrase structured like 'phrase:1jksdu294...:1928312390'
    //        data       -> the actual json object of all the notes
    //     */
    //     await redisClient.hSet(phrasesKey, phraseId, JSON.stringify(phraseData));
    //     await redisClient.expire(phrasesKey, 86400);
        
    //     const hostSocketId = await redisClient.get(`room:${roomCode}`);
    //     if (hostSocketId) {
    //         io.to(hostSocketId).emit('S:new-phrase-received', phraseData);
    //     }
    //     // send back message to user confirm and id to edit later
    //     socket.emit('S:phrase-saved', { phraseId, phraseName });
    // })
    socket.on('C:stop-phrase', async (payload: {roomCode: string}) => {
        // get hostSocket to emit to it the socket to stop playing
        const hostSocketId = await redisClient.get(`room:${payload.roomCode}`);
        if (hostSocketId) {
            io.to(hostSocketId).emit('S:phrase-stopped', { playerId: socket.id });
        }
    })
}