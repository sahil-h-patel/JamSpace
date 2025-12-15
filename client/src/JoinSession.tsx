import { AbsoluteCenter, Button, Field, Flex, Heading, Input, Text } from "@chakra-ui/react"
import { Link, useNavigate } from "react-router"
import { socket, socketService } from './services/socket';
import { useEffect, useState } from "react";
import { useSession, type Participant } from "./context/session";

function JoinSession() {

  const [name, setName] = useState("");
  const [inputRoomCode, setInputRoomCode] = useState("")
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setRole, setRoomCode, setParticipants, setStatus } = useSession();

  useEffect(() => {
    // Define what to do when joining is successful
    const onJoinSuccess = (payload: { roomCode: string, currentPlayers: Participant[] }) => {
      console.log("Joined room successfully:", payload.roomCode);
      console.log("Existing players:", payload.currentPlayers);
      setRole('player');
      setRoomCode(payload.roomCode);
      setParticipants(payload.currentPlayers);
      setStatus('lobby'); // Go to waiting room
      navigate('/session'); // The SessionManager will take over

      navigate('/session'); // CHANGE THIS to your actual next route
    };

    // Define what to do when joining fails
    const onJoinError = (message: string) => {
      console.error("Join failed:", message);
      setError(message); // Show error to user
    };

    // Attach listeners
    socket.on('S:join-success', onJoinSuccess);
    socket.on('S:join-error', onJoinError);

    // Cleanup listeners when component unmounts
    return () => {
      socket.off('S:join-success', onJoinSuccess);
      socket.off('S:join-error', onJoinError);
    };
  }, [navigate, setRole, setRoomCode, setStatus, setParticipants]);

  const handleConnect = () => {
    socketService.connect(); 
    socketService.joinSession({ 
      name: name, 
      roomCode: inputRoomCode 
    });
  }

  return (
    <>
      <AbsoluteCenter>
        <Flex gap="10" direction="column" align='center'>
          <Heading size='3xl'>Join Session</Heading>
          <Field.Root invalid={!!error}>
            <Field.Label>Name</Field.Label>
            <Input id='name' placeholder="John Doe" onChange={(e) => {setName(e.target.value); console.log(e.target.value)}}/>
          </Field.Root>
          <Field.Root invalid={!!error}>
            <Field.Label>Code</Field.Label>
            <Input id='code' placeholder="••••••" onChange={(e) => {setInputRoomCode(e.target.value); console.log(e.target.value)}}/>
          </Field.Root>
          {error && <Text color="red.500" fontSize="sm">{error}</Text>}
          <Flex direction="row" gap="5">
            <Button
              onClick={handleConnect}
              >Connect</Button>
            <Link to="/"><Button>Next</Button></Link>
          </Flex>
        </Flex>
      </AbsoluteCenter>
    </>
  )
}

export default JoinSession
