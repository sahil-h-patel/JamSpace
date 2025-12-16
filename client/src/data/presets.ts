export interface Phrase {
  id: string;
  name: string;
  description: string;
  abc: string;
  tags: string[];
}

export const PRESET_PHRASES: Phrase[] = [
  // --- FUNDAMENTAL STRUCTURES (Unified to C Major) ---
  {
    id: 'sentence-1',
    name: 'Classic Sentence',
    description: 'Presentation + Continuation + Cadence',
    tags: ['structure', 'classical'],
    abc: `X:1
%%MIDI program 0
M:4/4
L:1/4
K:C
c2 e2 | d2 G2 | c2 e2 | d2 G2 |
e f g a | g f e d | c G B, d | c4 |]`
  },
  {
    id: 'parallel-period',
    name: 'Parallel Period',
    description: 'Antecedent ends on HC; Consequent on PAC.',
    tags: ['structure', 'period'],
    // Transposed from G to C
    abc: `X:2
%%MIDI program 0
M:4/4
L:1/4
K:C
c e g f | e c d2 | c e g f | e2 d2 |
c e g f | e c d2 | c e d B | c4 |]`
  },
  {
    id: 'interrupted-period',
    name: 'Interrupted Period',
    description: 'Deceptive cadence (vi) interrupts resolution.',
    tags: ['structure', 'deceptive'],
    // Transposed from F to C
    abc: `X:3
%%MIDI program 0
M:4/4
L:1/4
K:C
c e g2 | d f a2 | g e c2 | B d G2 |
c e g2 | d f a2 | g b d' f' | e'4 |]`
  },

  // --- CHROMATIC HARMONY (Functioning in C) ---
  {
    id: 'italian-6th',
    name: 'Italian 6th',
    description: 'Expands outward to the octave (V of C).',
    tags: ['harmony', 'chromatic'],
    abc: `X:4
%%MIDI program 40
M:4/4
L:1/2
K:C
[_A, ^F] | [G, G] |]`
  },
  {
    id: 'french-6th',
    name: 'French 6th',
    description: 'Whole-tone crunch resolving to V.',
    tags: ['harmony', 'chromatic'],
    abc: `X:5
%%MIDI program 40
M:4/4
L:1/2
K:C
[_A, =C D ^F] | [G, B, D G] |]`
  },
  {
    id: 'german-6th',
    name: 'German 6th',
    description: 'The darkest 6th chord resolving to I6/4.',
    tags: ['harmony', 'chromatic'],
    abc: `X:6
%%MIDI program 40
M:4/4
L:1/2
K:C
[_A, =C _E ^F] | [G, C E G] | [G, B, D G] |]`
  },

  // --- TEXTURAL & MODAL VARIATIONS (Compatible with C) ---
  {
    id: 'ostinato-lydian',
    name: 'Lydian Ostinato',
    description: 'F Lydian shares the same notes as C Major (Relative Mode).',
    tags: ['modal', 'lydian'],
    // F Lydian is "White keys starting on F". Fits perfectly over C.
    abc: `X:7
%%MIDI program 12
M:4/4
L:1/8
K:F Lyd
F A c B G B d e | f e d c B G E C |
F A c B G B d e | f2 a2 g4 |]`
  },
  {
    id: 'polyphonic-duet',
    name: 'Counterpoint Duet',
    description: 'D Dorian shares the same notes as C Major.',
    tags: ['counterpoint', 'baroque'],
    // D Minor (Dorian) is relative to C.
    abc: `X:8
%%MIDI program 6
M:4/4
L:1/8
K:Dmin
V:1
d2 f2 a2 g2 | f e d c =B2 A2 |
V:2
D, F, A,2 C, E, G,2 | A, G, F, E, D,4 |]`
  },
  {
    id: 'alberti-bass',
    name: 'Alberti Bass',
    description: 'Classical broken chords (Transposed to C).',
    tags: ['accompaniment', 'classical'],
    // Transposed from Bb to C
    abc: `X:9
%%MIDI program 0
M:2/4
L:1/16
K:C
C E G E C E G E | F, A, D A, F, A, D A, | G, B, D B, G, B, D B, | C4 z4 |]`
  },
  {
    id: 'neapolitan-6th',
    name: 'Neapolitan 6th',
    description: 'A flash of Db Major resolving to C.',
    tags: ['harmony', 'chromatic'],
    // Keeping this in C Minor context adds "Modal Mixture" which is very cool in Aleatoric music.
    // It is "Spicy" but cohesive because it resolves to C.
    abc: `X:10
%%MIDI program 40
M:4/4
L:1/2
K:C
[F A c] | [_D F _A] | [G B d] | [c e g] |]`
  },
  {
    id: 'picardy-third',
    name: 'Picardy Third',
    description: 'Minor phrase ending in Major.',
    tags: ['cadence', 'baroque'],
    // Transposed from Gm to Am (Relative minor of C)
    abc: `X:11
%%MIDI program 19
M:4/4
L:1/4
K:Am
A c e d | c A B ^G | A c e d | ^c4 |]`
  },
  {
    id: 'walking-bass',
    name: 'Jazz Walk',
    description: 'ii-V-I in C.',
    tags: ['jazz', 'bass'],
    abc: `X:12
%%MIDI program 32
M:4/4
L:1/4
K:C
D, F, A, C | G, B, D F | C, E, G, B, | C,4 |]`
  }
];