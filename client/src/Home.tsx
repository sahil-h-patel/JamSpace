import { useEffect } from 'react';
import { AbsoluteCenter, Button, Flex, Text, VStack } from "@chakra-ui/react";
import { useNavigate, Link } from "react-router";
// import { socketService, socket } from '../services/socketService';
import { useSession } from './context/session';
import { socket, socketService } from './services/socket';

function Home() {
  const navigate = useNavigate();
  const { setRole, setRoomCode, setStatus } = useSession();

  // --- Socket Listeners for Creation ---
  useEffect(() => {
    // 1. Listen for the server giving us a Room Code
    const handleSessionCreated = (code: string) => {
      setRole('host');
      setRoomCode(code);
      setStatus('lobby'); // Go to waiting room
      navigate('/session'); // The SessionManager will take over
    };

    socket.on('S:session-created', handleSessionCreated);

    return () => {
      socket.off('S:session-created', handleSessionCreated);
    };
  }, [navigate, setRole, setRoomCode, setStatus]);

  const handleCreateSession = () => {
    // Connect and ask server for a room
    socketService.connect();
    socketService.createSession();
  };

  return (
    <AbsoluteCenter>
      <VStack gap={10} textAlign="center">
        <Text fontSize="3xl" color="gray.700">An Interactive Aleatoric Performance</Text>
        
        <Flex gap={6} direction="column" w="300px">
          <Button 
            size="xl" 
            colorPalette="cyan" 
            onClick={handleCreateSession}
          >
            Host Session
          </Button>
          
          <Link to='/join' style={{ width: '100%' }}>
            <Button 
              size="xl" 
              variant="outline" 
              width="full">
              Join Session
            </Button>
          </Link>
        </Flex>
      </VStack>
    </AbsoluteCenter>
  )
}

export default Home;