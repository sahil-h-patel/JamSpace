import { Box, Container, Heading, Text, SimpleGrid } from "@chakra-ui/react";
import { MusicNotation } from './components/ui/music-notation';
import { PRESET_PHRASES, type Phrase } from './data/presets';
import { socketService } from './services/socket';
import { useSession } from './context/session';

// --- The Performance Button ---
const PerformanceButton = ({ phrase, roomCode }: { phrase: Phrase, roomCode: string }) => {
    const handleClick = () => {
        // This is the core action: Send the ID to the server
        socketService.playPhrase(roomCode, phrase.id);
        
        // Optional: Add visual feedback (like a ripple effect or active state)
        // You could also track 'activePhraseId' in context to highlight the currently playing one.
    };

    return (
        <Box
            as="button"
            onClick={handleClick}
            bg="white"
            p={4}
            borderRadius="2xl"
            boxShadow="sm"
            border="2px solid"
            borderColor="transparent"
            transition="all 0.1s"
            _active={{
                transform: "scale(0.98)",
                borderColor: "cyan.500",
                bg: "cyan.50"
            }}
            w="100%"
        >
            <Text fontWeight="bold" fontSize="lg" mb={2} color="gray.700">
                {phrase.name}
            </Text>
            <Box pointerEvents="none">
                <MusicNotation abc={phrase.abc} id={`player-${phrase.id}`} scale={1.1} />
            </Box>
        </Box>
    );
};

// --- Main Player Component ---

function PlayerView() {
  const { roomCode } = useSession();

  if (!roomCode) return <Text>Error: No Room Code</Text>;

  return (
    <Box bg="gray.100" minH="100vh" pb={10}>
        {/* Header */}
        <Box bg="white" py={4} px={6} boxShadow="sm" mb={6}>
            <Heading size="md" color="cyan.600">Performance Mode</Heading>
            <Text fontSize="xs" color="gray.500">Connected to {roomCode}</Text>
        </Box>

        {/* The Pad */}
        <Container maxW="container.md">
            <Text fontSize="sm" mb={4} color="gray.500" textAlign="center">
                Tap a phrase to play it on the main speakers.
            </Text>
            
            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
                {PRESET_PHRASES.map((phrase) => (
                    <PerformanceButton 
                        key={phrase.id} 
                        phrase={phrase} 
                        roomCode={roomCode} 
                    />
                ))}
            </SimpleGrid>
        </Container>
    </Box>
  );
}

export default PlayerView;