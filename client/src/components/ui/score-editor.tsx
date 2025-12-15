import { useEffect, useState, useCallback } from 'react';
import { VexFlow } from 'vexflow';
import { Box, Button, HStack, Text, VStack, ButtonGroup } from '@chakra-ui/react';
import { 
  ArrowLeft, ArrowRight, ArrowUp, ArrowDown, 
//   Music, Check
} from 'lucide-react';
import { Score, Stave, Voice } from '../vexflow';
// --- Types ---

// Our internal data model for a note
// VexFlow requires specific formats (e.g. "c/4", "q")
export interface EditorNote {
  keys: string[]; // ["c/4"]
  duration: string; // "q", "8", "16"
  accidental?: string | null; // "#", "b", "n"
  isRest?: boolean;
}

interface ScoreEditorProps {
  // We can initialize with a simple array of notes
  initialNotes?: EditorNote[];
  onChange?: (notes: EditorNote[]) => void;
}

export const VF = VexFlow;

// Default Measure: C Major Scale
const DEFAULT_NOTES: EditorNote[] = [
  { keys: ['c/4'], duration: 'q' },
  { keys: ['d/4'], duration: 'q' },
  { keys: ['e/4'], duration: 'q' },
  { keys: ['f/4'], duration: 'q' },
];

export default function ScoreEditor({ initialNotes = DEFAULT_NOTES, onChange }: ScoreEditorProps) {
  const [notes, setNotes] = useState<EditorNote[]>(initialNotes);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // --- Interaction Helpers ---
  const updateNote = useCallback((index: number, partial: Partial<EditorNote>) => {
    const newNotes = [...notes];
    newNotes[index] = { ...newNotes[index], ...partial };
    setNotes(newNotes);
    if (onChange) onChange(newNotes);
  }, [notes, onChange]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (selectedIndex === -1) return;
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) e.preventDefault();

    switch (e.key) {
      case 'ArrowRight': setSelectedIndex((p) => Math.min(p + 1, notes.length - 1)); break;
      case 'ArrowLeft': setSelectedIndex((p) => Math.max(p - 1, 0)); break;
      case 'ArrowUp': 
        if (!notes[selectedIndex].isRest) {
          const newKey = transposeKey(notes[selectedIndex].keys[0], 1);
          updateNote(selectedIndex, { keys: [newKey], accidental: null });
        }
        break;
      case 'ArrowDown':
        if (!notes[selectedIndex].isRest) {
          const newKey = transposeKey(notes[selectedIndex].keys[0], -1);
          updateNote(selectedIndex, { keys: [newKey], accidental: null });
        }
        break;
    }
  }, [notes, selectedIndex, updateNote]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // --- Render ---
  return (
    <VStack gap={4} width="100%" alignItems="center">
      
      {/* 1. Declarative VexFlow Score */}
      <Box bg="white" p={4} borderRadius="md" boxShadow="sm" overflowX="auto">
        <Score width={600} height={200}>
          <Stave clef="treble" timeSignature="4/4" width={550}>
            <Voice 
              notes={notes} 
              selectedIndex={selectedIndex} 
              onNoteClick={setSelectedIndex} 
            />
          </Stave>
        </Score>
      </Box>

      {/* 2. Editor Toolbar */}
      <HStack gap={4} wrap="wrap" justify="center">
        {/* Navigation */}
        <ButtonGroup size="sm" variant="outline">
          <Button aria-label="Previous" 
            onClick={() => setSelectedIndex(Math.max(0, selectedIndex - 1))}>
              <ArrowLeft />
          </Button>
          <Button aria-label="Next"
           onClick={() => setSelectedIndex(Math.min(notes.length - 1, selectedIndex + 1))}>
            <ArrowRight />
           </Button>
        </ButtonGroup>

        {/* Pitch */}
        <ButtonGroup size="sm" variant="solid" colorPalette="blue">
          <Button aria-label="Up" onClick={() => {
             if (notes[selectedIndex].isRest) return;
             updateNote(selectedIndex, { keys: [transposeKey(notes[selectedIndex].keys[0], 1)], accidental: null });
          }}><ArrowUp/></Button>
          <Button aria-label="Down"  onClick={() => {
             if (notes[selectedIndex].isRest) return;
             updateNote(selectedIndex, { keys: [transposeKey(notes[selectedIndex].keys[0], -1)], accidental: null });
          }}><ArrowDown/></Button>
        </ButtonGroup>

        {/* Durations */}
        <ButtonGroup size="sm" variant="outline">
          <Button onClick={() => updateNote(selectedIndex, { duration: 'q' })}>1/4</Button>
          <Button onClick={() => updateNote(selectedIndex, { duration: '8' })}>1/8</Button>
        </ButtonGroup>
      </HStack>

      <Text fontSize="xs" color="gray.500">
        Selected: Note {selectedIndex + 1} ({notes[selectedIndex].duration})
      </Text>
    </VStack>
  );
}

function transposeKey(key: string, steps: number): string {
  const parts = key.split('/');
  if (parts.length !== 2) return key;
  const [note, octaveStr] = parts;
  let octave = parseInt(octaveStr, 10);
  const baseNote = note.replace(/[#bn]/, ''); 
  const scale = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];
  const idx = scale.indexOf(baseNote);
  let newIdx = idx + steps;
  
  if (newIdx > 6) { newIdx %= 7; octave++; } 
  else if (newIdx < 0) { newIdx = 7 + (newIdx % 7); if(newIdx===7) newIdx=0; octave--; }

  return `${scale[newIdx]}/${octave}`;
}

// export default function ScoreEditor({ initialNotes = DEFAULT_NOTES, onChange }: ScoreEditorProps) {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [notes, setNotes] = useState<EditorNote[]>(initialNotes);
//   const [selectedIndex, setSelectedIndex] = useState<number>(0);


//   // --- 1. The Rendering Loop ---
//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;

//     // A. Clean up previous SVG
//     container.innerHTML = '';
    
//     // B. Initialize Renderer
//     const renderer = new VF.Renderer(container, VF.Renderer.Backends.SVG);
//     renderer.resize(600, 200);
//     const context = renderer.getContext();

//     // C. Draw Stave
//     // x=10, y=40, width=500
//     const stave = new VF.Stave(10, 40, 550);
//     stave.addClef('treble').addTimeSignature('4/4');
//     stave.setContext(context).draw();

//     // D. Convert React State to VexFlow StaveNotes
//     const vfNotes = notes.map((note, index) => {
//       // 1. Create Note
//       const staveNote = new VF.StaveNote({
//         keys: note.keys,
//         duration: note.isRest ? note.duration + 'r' : note.duration,
//         autoStem: true,
//       });

//       // 2. Add Accidentals
//       if (note.accidental && !note.isRest) {
//         staveNote.addModifier(new VF.Accidental(note.accidental));
//       }

//       // 3. Highlight Selected Note
//       if (index === selectedIndex) {
//         staveNote.setStyle({ fillStyle: '#3182ce', strokeStyle: '#3182ce' });
//       }

//       return staveNote;
//     });

//     // E. Format & Draw
//     // VexFlow's Formatter calculates x-positions to avoid collisions
//     const voice = new VF.Voice({ numBeats: 4, beatValue: 4 });
    
//     // IMPORTANT: VexFlow is strict about time. 
//     // If notes don't add up to 4/4, it throws an error.
//     // We wrap in try/catch to prevent app crash during editing.
//     try {
//       voice.addTickables(vfNotes);
//       new VF.Formatter().joinVoices([voice]).format([voice], 500);
      
//       voice.draw(context, stave);

//       // Add Beams automatically
//       // Filters out rests and checks duration to auto-beam 8ths/16ths
//       const beams = VF.Beam.generateBeams(vfNotes);
//       beams.forEach((b) => b.setContext(context).draw());

//     } catch (e) {
//       console.warn("VexFlow Formatting Error (measure probably incomplete):", e);
//     }

//     // --- F. Attach Click Listeners to SVG Elements ---
//     // VexFlow doesn't support events natively, so we hook into the DOM nodes it created.
//     // The class 'vf-stavenote' is added by VexFlow to note groups.
//     const noteGroups = container.querySelectorAll('.vf-stavenote');
//     noteGroups.forEach((group, index) => {
//       group.addEventListener('click', () => {
//         setSelectedIndex(index);
//       });
//       (group as HTMLElement).style.cursor = 'pointer';
//     });

//   }, [notes, selectedIndex]);


//   // --- 2. Interaction Logic ---

//   const updateNote = useCallback((index: number, partial: Partial<EditorNote>) => {
//     const newNotes = [...notes];
//     newNotes[index] = { ...newNotes[index], ...partial };
//     setNotes(newNotes);
//     if (onChange) onChange(newNotes);
//   }, [notes, onChange]);

//     const handleKeyDown = useCallback((e: KeyboardEvent) => {
//         if (selectedIndex === -1 || selectedIndex >= notes.length) return;

//         // Prevent scrolling
//         if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
//         e.preventDefault();
//     }

//     switch (e.key) {
//       case 'ArrowRight':
//         setSelectedIndex((prev) => Math.min(prev + 1, notes.length - 1));
//         break;
//       case 'ArrowLeft':
//         setSelectedIndex((prev) => Math.max(prev - 1, 0));
//         break;
//       case 'ArrowUp': {
//         const current = notes[selectedIndex];
//         // Don't transpose rests
//         if (current.isRest) break;
//         const newKey = transposeKey(current.keys[0], 1);
//         updateNote(selectedIndex, { keys: [newKey], accidental: null }); // Clear accidental on step
//         break;
//       }
//       case 'ArrowDown': {
//         const current = notes[selectedIndex];
//         if (current.isRest) break;
//         const newKey = transposeKey(current.keys[0], -1);
//         updateNote(selectedIndex, { keys: [newKey], accidental: null });
//         break;
//       }
//     }
//   }, [notes, selectedIndex, updateNote]);

//   useEffect(() => {
//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [handleKeyDown]);


//   // --- 3. UI Helpers ---

//   const toggleAccidental = (acc: string) => {
//     const current = notes[selectedIndex];
//     // Toggle off if same, otherwise set
//     const newAcc = current.accidental === acc ? null : acc;
//     updateNote(selectedIndex, { accidental: newAcc });
//   };

//   const setDuration = (dur: string) => {
//     updateNote(selectedIndex, { duration: dur });
//   };

//   return (
//     <VStack gap={4} width="100%" alignItems="center">
      
//       {/* VexFlow Container */}
//       <Box 
//         ref={containerRef} 
//         width="100%" 
//         bg="white" 
//         borderRadius="md" 
//         boxShadow="sm" 
//         p={4}
//         overflowX="auto"
//         display="flex"
//         justifyContent="center"
//       />

//       {/* Editor Toolbar */}
//       <HStack gap={4} wrap="wrap" justify="center">
        
//         {/* Navigation */}
//         <ButtonGroup size="sm" variant="outline">
//           <Button aria-label="Previous" onClick={() => setSelectedIndex(Math.max(0, selectedIndex - 1))}><ArrowLeft /></Button>
//           <Button aria-label="Next" onClick={() => setSelectedIndex(Math.min(notes.length - 1, selectedIndex + 1))}><ArrowRight /></Button>
//         </ButtonGroup>

//         {/* Pitch Control */}
//         <ButtonGroup size="sm" variant="solid" colorScheme="blue">
//           <Button aria-label="Pitch Up" onClick={() => {
//              if (notes[selectedIndex].isRest) return;
//              const newKey = transposeKey(notes[selectedIndex].keys[0], 1);
//              updateNote(selectedIndex, { keys: [newKey], accidental: null });
//           }}><ArrowUp /></Button>
//           <Button aria-label="Pitch Down" onClick={() => {
//              if (notes[selectedIndex].isRest) return;
//              const newKey = transposeKey(notes[selectedIndex].keys[0], -1);
//              updateNote(selectedIndex, { keys: [newKey], accidental: null });
//           }}><ArrowDown/></Button>
//         </ButtonGroup>

//         {/* Accidentals */}
//         <ButtonGroup size="sm"  variant="outline">
//           <Button onClick={() => toggleAccidental('#')}>♯</Button>
//           <Button onClick={() => toggleAccidental('b')}>♭</Button>
//           <Button onClick={() => toggleAccidental('n')}>♮</Button>
//         </ButtonGroup>

//         {/* Durations */}
//         <ButtonGroup size="sm"  variant="outline">
//           <Button onClick={() => setDuration('q')}>1/4</Button>
//           <Button onClick={() => setDuration('8')}>1/8</Button>
//           <Button onClick={() => setDuration('16')}>1/16</Button>
//         </ButtonGroup>

//       </HStack>

//       <Text fontSize="xs" color="gray.500">
//         Selected: Note {selectedIndex + 1} | Keys: {notes[selectedIndex]?.keys[0]}
//       </Text>

//     </VStack>
//   );
// }

// // --- HELPER: VexFlow Pitch Transposition ---
// // Logic to move "c/4" -> "d/4" etc.
// function transposeKey(key: string, steps: number): string {
//   // Key format: "c/4" or "c#/4"
//   // 1. Parse
//   const parts = key.split('/');
//   if (parts.length !== 2) return key;

//   const note = parts[0]; // "c" or "c#"
//   let octave = parseInt(parts[1], 10);

//   // Strip accidental for simple diatonic movement logic
//   // (We handle accidentals separately via buttons usually)
//   const baseNote = note.replace(/[#bn]/, ''); 

//   // 2. Define Scale
//   const scale = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];
//   const idx = scale.indexOf(baseNote);

//   if (idx === -1) return key;

//   // 3. Shift
//   let newIdx = idx + steps;
  
//   // Handle Octave Wrap
//   if (newIdx > 6) {
//     newIdx = newIdx % 7;
//     octave += 1;
//   } else if (newIdx < 0) {
//     newIdx = 7 + (newIdx % 7); // JS modulo of negative numbers is tricky
//     if (newIdx === 7) newIdx = 0; // Edge case
//     octave -= 1;
//   }

//   // 4. Reconstruct
//   return `${scale[newIdx]}/${octave}`;
// }