import { useContext, useLayoutEffect } from 'react';
import { StaveNote, Accidental, Voice as VexVoice, Formatter, Beam } from 'vexflow';
import { RendererContext, StaveContext } from './context';
import { type EditorNote } from '../ui/score-editor'; 

interface VoiceProps {
  notes: EditorNote[];
  selectedIndex?: number;
  onNoteClick?: (index: number) => void;
}

export const Voice = ({ notes, selectedIndex, onNoteClick }: VoiceProps) => {
  const { context } = useContext(RendererContext)!;
  const { stave } = useContext(StaveContext)!;

  useLayoutEffect(() => {

    const group = context.openGroup();
    // 1. Convert Props to VexFlow Notes
    const vfNotes = notes.map((note, index) => {
      const staveNote = new StaveNote({
        keys: note.keys,
        duration: note.isRest ? note.duration + 'r' : note.duration,
        autoStem: true,
      });

      if (note.accidental && !note.isRest) {
        staveNote.addModifier(new Accidental(note.accidental));
      }

      // Highlight logic
      if (index === selectedIndex) {
        staveNote.setStyle({ fillStyle: '#3182ce', strokeStyle: '#3182ce' });
      } else {
        staveNote.setStyle({ fillStyle: 'black', strokeStyle: 'black' });
      }

      return staveNote;
    });

    // 2. Create Voice (Time container)
    const voice = new VexVoice({ numBeats: 4, beatValue: 4 });
    
    try {
      voice.addTickables(vfNotes);

      // 3. Format
      new Formatter().joinVoices([voice]).format([voice], stave.getWidth() - 50);

      // 4. Draw
      voice.draw(context, stave);

      // 5. Beaming
      const beams = Beam.generateBeams(vfNotes);
      beams.forEach(beam => beam.setContext(context).draw());

      // 6. Interaction
      vfNotes.forEach((vfNote, index) => {
        const svgEl = vfNote.getAttribute('el'); 
        if (svgEl) {
          svgEl.addEventListener('click', () => {
            if (onNoteClick) onNoteClick(index);
          });
          svgEl.style.cursor = 'pointer';
        }
      });

    } catch (e) {
      console.warn("VexFlow Render Error:", e);
    }

    context.closeGroup();

    // 9. CLEANUP FUNCTION
    // This runs before the NEXT effect. We remove the entire group 
    // from the DOM, effectively "clearing" only these notes.
    return () => {
      if (group && group.parentNode) {
        group.parentNode.removeChild(group);
      }
    };

  }, [context, stave, notes, selectedIndex, onNoteClick]);

  return null;
};