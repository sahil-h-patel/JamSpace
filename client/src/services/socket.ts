import { io, Socket } from 'socket.io-client';

// 1. Setup the connection
// In production, use the env variable. In dev, fallback to localhost.
const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

export const socket: Socket = io(SERVER_URL, {
  autoConnect: false, // We connect manually when the user clicks "Join" or "Create"
});

// --- TYPE DEFINITIONS ---
// These mirror the data structures expected by the backend

export interface JoinSessionPayload {
  roomCode: string;
  name: string;
  // AvatarURL removed per your latest requirements
}

export interface Note {
  pitch: string;
  startStep: number;
  durationSteps: number;
}

// --- CLIENT ACTIONS (The "Emitters") ---
// React components import 'socketService' to perform actions.

export const socketService = {
  // --- Connection Management ---
  connect: () => {
    if (!socket.connected) socket.connect();
  },
  
  disconnect: () => {
    if (socket.connected) socket.disconnect();
  },

  // --- Session Logic ---
  createSession: () => {
    socket.emit('C:host-create-room');
  },

  joinSession: (payload: JoinSessionPayload) => {
    socket.emit('C:join-room', payload);
  },

  startPerformance: (roomCode: string) => {
    socket.emit('C:start-performance', { roomCode });
  },

  stopPerformance: (roomCode: string) => {
    socket.emit('C:stop-performance', { roomCode });
  },

  // --- Music Logic ---
  playPhrase: (roomCode: string, phraseId: string) => {
    socket.emit('C:play-phrase', { roomCode, phraseId });
  },

  stopPhrase: (roomCode: string) => {
    socket.emit('C:stop-phrase', { roomCode });
  },

  // Used if you re-enable custom phrase creation later
  // submitPhrase: (roomCode: string, phraseName: string, notes: Note[]) => {
  //   socket.emit('C:submit-phrase', { roomCode, phraseName, notes });
  // }
};