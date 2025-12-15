export interface JoinSessionPayload {
  roomCode: string;
  name: string;
}

export interface PlayPhrasePayload {
  roomCode: string;
  phraseId: string;
}

export interface CreatePhrasePayload {
  roomCode: string;
  phraseId?: string; 
  phraseName: string;
  notes: Note[];
}

export interface Note {
  pitch: string;
  startStep: number;
  durationSteps: number;
}