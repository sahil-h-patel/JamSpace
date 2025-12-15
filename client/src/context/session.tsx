import { createContext, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';

// Define the shape of our Session State
type SessionStatus = 'lobby' | 'active' | 'ended';
type UserRole = 'host' | 'player' | null;

export interface Participant {
  id: string; // socket.id
  name: string;
  role: string;
}

interface SessionContextType {
  roomCode: string | null;
  setRoomCode: (code: string) => void;
  
  role: UserRole;
  setRole: (role: UserRole) => void;
  
  status: SessionStatus;
  setStatus: (status: SessionStatus) => void;
  
  participants: Participant[];
  setParticipants: Dispatch<SetStateAction<Participant[]>>
  
  // Helper to check if current user is host
  isHost: boolean;
}

const SessionContext = createContext<SessionContextType | null>(null);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [status, setStatus] = useState<SessionStatus>('lobby');
  const [participants, setParticipants] = useState<Participant[]>([]);

  return (
    <SessionContext.Provider value={{
      roomCode,
      setRoomCode,
      role,
      setRole,
      status,
      setStatus,
      participants,
      setParticipants,
      isHost: role === 'host'
    }}>
      {children}
    </SessionContext.Provider>
  );
};

// Custom Hook for easy access
// eslint-disable-next-line react-refresh/only-export-components
export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useSession must be used within a SessionProvider");
  return context;
};