import { Box, Flex, Heading, Text, VStack, SimpleGrid, Icon, HStack } from "@chakra-ui/react";
import { Star, User, Music } from 'lucide-react';
import abcjs from 'abcjs';

import { MusicNotation } from './components/ui/music-notation';
import { PRESET_PHRASES, type Phrase } from './data/presets';
import { useSession } from './context/session';

// --- Sub-Components ---

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

const PhrasePreview = ({ phrase }: { phrase: Phrase }) => {
    // Helper to play local audio for the host (preview)
    const playPreview = () => {
        const synth = new abcjs.synth.CreateSynth();
        const visualObj = abcjs.renderAbc("*", phrase.abc)[0];
        synth.init({ visualObj }).then(() => synth.prime()).then(() => synth.start());
    };

    return (
        <Box
            as="button"
            onClick={playPreview}
            bg="white"
            p={4}
            borderRadius="xl"
            boxShadow="sm"
            border="1px solid"
            borderColor="gray.200"
            transition="all 0.2s"
            _hover={{ transform: "translateY(-2px)", boxShadow: "md", borderColor: "cyan.400" }}
            textAlign="left"
        >
            <HStack justify="space-between" mb={2}>
                <Text fontWeight="bold" color="gray.700">{phrase.name}</Text>
                <Icon as={Music} size={'md'} color="gray.400" />
            </HStack>
            {/* The visual notation */}
            <Box pointerEvents="none"> 
                <MusicNotation abc={phrase.abc} id={`host-${phrase.id}`} scale={0.8} />
            </Box>
        </Box>
    );
};

// --- Main Host Component ---

function HostView() {
  const { roomCode, participants } = useSession();

  return (
    <Flex direction='row' h="100vh" overflow="hidden" bg="gray.50">
        
        {/* SIDEBAR: Roster */}
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
                {/* Ensure the Host is always at the top */}
                <ParticipantRow name="You (Host)" role="Conductor" isHost />
                {participants.map((p) => (
                    <ParticipantRow key={p.id} name={p.name} role={p.role} />
                ))}
            </VStack>
        </Flex>

        {/* MAIN STAGE: Phrase Monitor */}
        <Box flex="1" p={8} overflowY="auto">
            <Heading size="lg" mb={2}>Orchestra Deck</Heading>
            <Text color="gray.500" mb={8}>
                Click any phrase to preview it locally. Your students have these on their screens.
            </Text>
            
            <SimpleGrid columns={{ base: 1, xl: 2, '2xl': 3 }} gap={6}>
               {PRESET_PHRASES.map((phrase) => (
                    <PhrasePreview key={phrase.id} phrase={phrase} />
               ))}
            </SimpleGrid>
        </Box>
    </Flex>
  )
}

export default HostView;