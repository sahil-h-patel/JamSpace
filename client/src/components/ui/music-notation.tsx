import { useEffect, useRef } from 'react';
import abcjs, { type AbcElem } from 'abcjs';
import { Box } from '@chakra-ui/react';

interface MusicNotationProps {
  abc: string;
  id?: string;
  scale?: number;
  onNoteClick?: (noteInfo: AbcElem) => void; // We'll refine this type
  isClickable?: boolean;
}

export const MusicNotation = ({ 
  abc, 
  id = 'notation', 
  scale = 1.5, 
  onNoteClick,
  isClickable = false 
}: MusicNotationProps) => {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!divRef.current) return;

    const renderOptions: abcjs.AbcVisualParams = {
      add_classes: true, // Adds classes like 'abcjs-note', 'abcjs-bar'
      scale: scale,
      // If provided, this function runs when a user clicks a note
      clickListener: isClickable ? (abcelem: AbcElem) => {
        if (onNoteClick && abcelem.el_type === 'note') {
          onNoteClick(abcelem);
        }
      } : undefined
    };

    abcjs.renderAbc(divRef.current, abc, renderOptions);

  }, [abc, scale, isClickable, onNoteClick]);

  return (
    <Box 
      ref={divRef} 
      id={id} 
      width="100%" 
      color="black"
      // Basic styling to ensure visibility
      css={{
        "& svg": { display: "block" },
        "& [class^='abcjs-'] path": { 
          fill: "currentColor" 
        },// Inherit text color
        "& .abcjs-note:hover": isClickable ? { fill: "#3182ce", cursor: "pointer" } : {}
      }}
    />
  );
};