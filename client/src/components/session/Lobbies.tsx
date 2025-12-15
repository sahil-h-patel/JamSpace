import { Box, Button, Flex, Heading, Text, VStack, HStack, Card } from '@chakra-ui/react';
import { useSession } from '../../context/session';
import { MusicNotation } from '../ui/music-notation';
import { PRESET_PHRASES } from '../../data/presets';
import { socket, socketService } from '../../services/socket';
import { useRoomListeners } from '@/hooks/useRoomListeners';

// --- HOST LOBBY ---
export const HostLobby = () => {
  const { roomCode, participants, setStatus } = useSession();

  const handleStartSession = () => {
    socketService.startPerformance(roomCode!); // You'll need to add this to socketService
    setStatus('active'); // Update local state immediately (or wait for server event)
  };

  useRoomListeners();

  return (
    <Flex direction="column" h="100vh" bg="gray.900" color="white" p={8}>
      
      {/* 1. Center Stage: The Code */}
      <Flex flex="1" direction="column" align="center" justify="center" gap={4}>
        <Text fontSize="xl" color="gray.400" textTransform="uppercase" letterSpacing="widest">
          Join Code
        </Text>
        <Heading size="6xl" color="cyan.400" letterSpacing="wider">
          {roomCode?.split('').join(' ')}
        </Heading>
        <Text fontSize="lg" mt={4}>
          Waiting for players... ({participants.length} joined)
        </Text>
        <Button 
          size="2xl" 
          colorPalette="green" 
          mt={8} 
          onClick={handleStartSession}
          disabled={participants.length === 0}
        >
          Start Session
        </Button>
      </Flex>

      {/* 2. Bottom: Phrase Preview Scroller */}
      <Box h="250px" borderTop="1px solid" borderColor="gray.700" pt={4}>
        <Text fontSize="sm" mb={4} color="gray.400">Available Phrases</Text>
        <HStack overflowX="auto" gap={4} pb={4} css={{ '&::-webkit-scrollbar': { display: 'none' } }}>
          {PRESET_PHRASES.map(phrase => (
            <Card.Root key={phrase.id} minW="300px" bg="gray.800" borderColor="gray.700" color="white">
              <Card.Body p={3}>
                <Box bg="white" borderRadius="sm" p={1}>
                  {/* Preview only - no click handler */}
                  <MusicNotation abc={phrase.abc} scale={0.8} />
                </Box>
              </Card.Body>
            </Card.Root>
          ))}
        </HStack>
      </Box>
    </Flex>
  );
};

// --- PLAYER LOBBY ---
export const PlayerLobby = () => {
  const { roomCode, participants } = useSession();
  useRoomListeners();

  return (
    <Flex direction="column" h="100vh" bg="gray.900" p={6}>
      <VStack gap={2} mb={8} pt={10}>
        <Text color="gray.200">Connected to Session</Text>
        <Heading size="4xl" color="cyan.600">{roomCode}</Heading>
        <Text fontSize="sm" color="gray.400">Waiting for host to start...</Text>
      </VStack>

      <Box bg="gray.800" borderRadius="xl" shadow="sm" flex="1" p={4}>
        <Heading size="sm" mb={4} color="gray.200">Players ({participants.length})</Heading>
        <VStack align="stretch" gap={2}>
          {participants.map((p) => (
            <Box key={p.id} p={3} bg="gray.900" borderRadius="md">
              <Text fontWeight="medium" color="white">{p.id === socket.id ? 'You' : p.name}</Text>
              <Text fontSize="xs" color="gray.200">{p.role}</Text>
            </Box>
          ))}
        </VStack>
      </Box>
    </Flex>
  );
};