import { useEffect } from 'react';
import { socket } from '../services/socket';
import { useSession } from '../context/session';

export const useRoomListeners = () => {
  const { setParticipants } = useSession();

  useEffect(() => {
    const handlePlayerJoined = (payload: { id: string; name: string }) => {
      console.log('Syncing: Player joined', payload);
      setParticipants((prev) => {
        if (prev.some((p) => p.id === payload.id)) return prev;
        return [...prev, { id: payload.id, name: payload.name, role: 'player' }];
      });
    };

    const handlePlayerLeft = (payload: { playerId: string }) => {
      console.log('Syncing: Player left', payload);
      setParticipants((prev) => prev.filter((p) => p.id !== payload.playerId));
    };

    socket.on('S:player-joined', handlePlayerJoined);
    socket.on('S:player-left', handlePlayerLeft);

    return () => {
      socket.off('S:player-joined', handlePlayerJoined);
      socket.off('S:player-left', handlePlayerLeft);
    };
  }, [setParticipants]);
};