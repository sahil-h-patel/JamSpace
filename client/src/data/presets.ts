export interface Phrase {
  id: string;
  name: string;
  description: string;
  abc: string; // The musical notation
  tags: string[]; // e.g. 'bass', 'melody', 'rhythmic'
}

export const PRESET_PHRASES: Phrase[] = [
  {
    id: 'bass-ostinato-1',
    name: 'Modal Bass Walk',
    description: 'A steady quarter-note walking bass line in D Dorian.',
    tags: ['bass', 'dorian'],
    // Added '%%MIDI program 32' for Acoustic Bass
    abc: `X:1
%%MIDI program 16
M:4/4
L:1/4
K:Ddor
D, F, G, A, | C, E, F, G, |`
  },
  {
    id: 'melody-motif-a',
    name: 'Lydian Flutter',
    description: 'Quick 16th note arpeggios highlighting the #4.',
    tags: ['melody', 'lydian'],
    // Added '%%MIDI program 73' for Flute
    abc: `X:1
%%MIDI program 73
M:4/4
L:1/16
K:Clyd
C E G B d B G E | C4 z4 |`
  },
  {
    id: 'pad-texture-1',
    name: 'Suspended Pad',
    description: 'Long tones creating a harmonic bed.',
    tags: ['pad', 'harmony'],
    // Added '%%MIDI program 89' for Warm Pad
    abc: `X:1
%%MIDI program 89
M:4/4
L:1/1
K:C
[C G c] | [D A d] |`
  },
  {
    id: 'percussion-beat-1',
    name: 'Simple Backbeat',
    description: 'Basic rhythmic pulse.',
    tags: ['percussion', 'rhythmic'],
    // Added '%%MIDI channel 10' for Drums (Channel 10 is reserved for drums in MIDI)
    abc: `X:1
%%MIDI channel 10
M:4/4
L:1/4
K:C
C ^F C ^F | C ^F C ^F |`
  }
];