import { Box, Flex, Heading, Text, VStack, SimpleGrid, Icon, HStack } from "@chakra-ui/react";
import { Star, User, Music } from 'lucide-react';
import { MusicNotation } from './components/ui/music-notation';
import { PRESET_PHRASES, type Phrase } from './data/presets';
import { useSession } from './context/session';
import { socketService, socket } from './services/socket'
import { useEffect, useRef, useState } from "react";
import abcjs, { type TuneObject } from 'abcjs'

interface AbcSynth {
    init: (options: { visualObj: TuneObject }) => Promise<void>;
    prime: () => Promise<{duration: number}>;
    start: () => Promise<void>;
    stop: () => void;
}

interface ActiveLoop {
    phraseId: string;
    shouldLoop: boolean;
    synth: AbcSynth | null;
}

const ParticipantRow = ({ name, isHost }: { name: string, role: string, isHost?: boolean }) => (
    <Flex 
        width='100%' 
        align='center' 
        justify="space-between" 
        p={3} 
        bg={isHost ? "cyan.50" : "white"} 
        borderRadius="md" 
        boxShadow="sm"
        borderLeft={isHost ? "4px solid" : "none"}
        borderColor="cyan.400"
    >
        <HStack gap={3}>
            <Icon as={isHost ? Star : User} color={isHost ? "cyan.500" : "gray.400"} />
            <VStack align="start" gap={0}>
                <Text fontSize='sm' fontWeight='bold' color="gray.700">{name}</Text>
                {/* In a real app, 'role' might come from Redis */}
                <Text fontSize='xs' color="gray.500">{isHost ? "Conductor" : "Musician"}</Text>
            </VStack>
        </HStack>
    </Flex>
);

const JamButton = ({ phrase, roomCode, isActive }: { phrase: Phrase, roomCode: string, isActive: boolean }) => {
    
    const handleClick = () => {
        if (isActive) {
            socketService.stopPhrase(roomCode);
        } else {
            socketService.playPhrase(roomCode, phrase.id);
        }
    };

    return (
        <Box
            as="button"
            onClick={handleClick}
            bg="white"
            p={4}
            borderRadius="xl"
            boxShadow="sm"
            border="1px solid"
            borderColor="gray.200"
            transition="all 0.1s"
            _active={{ 
                transform: "scale(0.98)", 
                borderColor: "cyan.500",
                bg: "cyan.50" 
            }}
            textAlign="left"
            overflow="hidden"
            position="relative"
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
                <MusicNotation abc={phrase.abc} id={`host-${phrase.id}`} scale={0.8} />
            </Box>
        </Box>
    );
};

// --- Main Host Component ---

function HostView() {
  const { roomCode, participants } = useSession();
  const [myActivePhraseId, setMyActivePhraseId] = useState<string | null>(null);

  // Map stores the Loop Controller for each player
  const loopsRef = useRef<Map<string, ActiveLoop>>(new Map());

  useEffect(() => {
    const handlePhrasePlayed = async (payload: { playerId: string, phraseId: string }) => {
        const { playerId, phraseId } = payload;
        
        if (playerId === socket.id) setMyActivePhraseId(phraseId);

        // 1. CLEANUP
        if (loopsRef.current.has(playerId)) {
            const oldLoop = loopsRef.current.get(playerId)!;
            oldLoop.shouldLoop = false;
            if (oldLoop.synth) oldLoop.synth.stop();
            loopsRef.current.delete(playerId);
        }

        // 2. SETUP
        const loopData: ActiveLoop = {
            phraseId,
            shouldLoop: true,
            synth: null
        };
        loopsRef.current.set(playerId, loopData);

        const phrase = PRESET_PHRASES.find(p => p.id === phraseId);
        if (!phrase) return;

        // 3. EXECUTE LOOP
        while (loopData.shouldLoop) {
            const synth = new abcjs.synth.CreateSynth() as unknown as AbcSynth;
            loopData.synth = synth;
            
            const visualObj = abcjs.renderAbc("*", phrase.abc)[0];

            try {
                await synth.init({ visualObj });
                
                // prime() calculates the audio buffer and returns the DURATION
                const result = await synth.prime(); 
                const durationMs = result.duration * 1000;

                // Start playback (resolves immediately)
                await synth.start(); 

                // --- CRITICAL FIX: WAIT FOR AUDIO TO FINISH ---
                // We pause the loop for the exact length of the audio file
                if (loopData.shouldLoop) {
                    await new Promise(resolve => setTimeout(resolve, durationMs));
                }

            } catch (err) {
                console.error("Audio Engine Error:", err);
                break;
            }
        }
    };

    const handlePhraseStopped = (payload: { playerId: string }) => {
        const { playerId } = payload;
        if (playerId === socket.id) setMyActivePhraseId(null);

        if (loopsRef.current.has(playerId)) {
            const loop = loopsRef.current.get(playerId)!;
            loop.shouldLoop = false;
            if (loop.synth) loop.synth.stop();
            loopsRef.current.delete(playerId);
        }
    };

    socket.on('S:phrase-played', handlePhrasePlayed);
    socket.on('S:phrase-stopped', handlePhraseStopped);

    return () => {
        socket.off('S:phrase-played', handlePhrasePlayed);
        socket.off('S:phrase-stopped', handlePhraseStopped);
        loopsRef.current.forEach(loop => {
            loop.shouldLoop = false;
            if (loop.synth) loop.synth.stop();
        });
        loopsRef.current.clear();
    };
  }, []);
  
  return (
    <Flex direction='row' h="100vh" overflow="hidden" bg="gray.50">
        
        {/* SIDEBAR: Roster (No changes needed) */}
        <Flex 
            direction='column' 
            p={6} 
            gap={6} 
            w="320px" 
            minW="320px"
            borderRight="1px solid" 
            borderColor="gray.200"
            bg="white"
        >
            <VStack align="start" gap={1}>
                <Text fontSize="xs" fontWeight="bold" color="gray.400" textTransform="uppercase">Live Session</Text>
                <Heading size='3xl' color="cyan.500">{roomCode}</Heading>
            </VStack>
            
            <Text fontSize='sm' color="gray.500" fontWeight="bold" mt={4}>
                Ensemble ({participants.length})
            </Text>            
            
            <VStack w="100%" gap={3} overflowY="auto">
                <ParticipantRow name="You (Host)" role="Conductor" isHost />
                {participants.map((p) => (
                    <ParticipantRow key={p.id} name={p.name} role={p.role} />
                ))}
            </VStack>
        </Flex>

        {/* MAIN STAGE */}
        <Box flex="1" p={8} overflowY="auto">
            <Heading size="lg" mb={2}>Soundboard</Heading>
            <Text color="gray.500" mb={8}>
                Session is live. You and the players have full control.
            </Text>
            
            <SimpleGrid columns={{ base: 1, xl: 2, '2xl': 3 }} gap={6}>
               {PRESET_PHRASES.map((phrase) => (
                    <JamButton 
                        key={phrase.id} 
                        phrase={phrase} 
                        roomCode={roomCode!}
                        isActive={myActivePhraseId === phrase.id} // roomCode is guaranteed here 
                    />
               ))}
            </SimpleGrid>
        </Box>
    </Flex>
  )
}

export default HostView;