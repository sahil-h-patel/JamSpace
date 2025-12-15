import { useEffect } from 'react';
import { useSession } from '../../context/session';
import { HostLobby, PlayerLobby } from './Lobbies';
import HostView from '../../HostView'; // Your existing Active View
import PlayerView from '../../PlayerView'; // Your existing Active View
import { Spinner, Center } from '@chakra-ui/react';
import { useNavigate } from 'react-router';

export const SessionManager = () => {
  const { role, status, roomCode } = useSession();
  const navigate = useNavigate();

  // Safety Redirect: If no role/code (user refreshed page), go home
  useEffect(() => {
    if (!role || !roomCode) {
      navigate('/');
    }
  }, [role, roomCode, navigate]);

  if (!role || !roomCode) return <Center h="100vh"><Spinner /></Center>;

  // --- RENDER LOGIC ---

  // 1. Lobby State
  if (status === 'lobby') {
    return role === 'host' ? <HostLobby /> : <PlayerLobby />;
  }

  // 2. Active State
  if (status === 'active') {
    return role === 'host' ? <HostView /> : <PlayerView />;
  }

  return <div>Unknown State</div>;
};