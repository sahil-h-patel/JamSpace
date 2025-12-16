import { Box, Container, Heading, Text, SimpleGrid, Icon } from "@chakra-ui/react";
import { MusicNotation } from './components/ui/music-notation';
import { PRESET_PHRASES, type Phrase } from './data/presets';
import { socketService } from './services/socket';
import { useSession } from './context/session';
import { useState } from "react";
import { Music } from "lucide-react";

// --- The Performance Button ---
const PerformanceButton = ({ phrase, roomCode, isActive, onClick }: { phrase: Phrase, roomCode: string, isActive: boolean, onClick: (id: string) => void}) => {
    
    const handleClick = () => {
        if (isActive) {
            // If already active, toggle OFF
            socketService.stopPhrase(roomCode);
            onClick(''); // Clear local state
        } else {
            // If new, toggle ON
            socketService.playPhrase(roomCode, phrase.id);
            onClick(phrase.id); // Set local state
        }
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
            {isActive && (
                <Icon 
                    as={Music} 
                    position="absolute" 
                    top={2} 
                    right={2} 
                    color="cyan.500" 
                    className="animate-pulse" 
                    zIndex={2}
                />
            )}
            <Box pointerEvents="none">
                <MusicNotation abc={phrase.abc} id={`player-${phrase.id}`} scale={1.1} />
            </Box>
        </Box>
    );
};

// --- Main Player Component ---

function PlayerView() {
  const { roomCode } = useSession();
  const [activePhraseId, setActivePhraseId] = useState<string>('');

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
                        isActive={activePhraseId === phrase.id}
                        onClick={setActivePhraseId}
                    />
                ))}
            </SimpleGrid>
        </Container>
    </Box>
  );
}

export default PlayerView;