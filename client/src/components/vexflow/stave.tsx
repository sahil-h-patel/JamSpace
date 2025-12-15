import React, { useContext, useState, useLayoutEffect } from 'react';
import { Stave as VexStave } from 'vexflow';
import { RendererContext, StaveContext } from './context';

interface StaveProps {
  x?: number;
  y?: number;
  width?: number;
  clef?: string;
  timeSignature?: string;
  children?: React.ReactNode;
}

export const Stave = ({ 
  x = 10, 
  y = 40, 
  width = 500, 
  clef = 'treble', 
  timeSignature = '4/4',
  children 
}: StaveProps) => {
  const { context } = useContext(RendererContext)!;
  const [staveVal, setStaveVal] = useState<{ stave: VexStave; width: number } | null>(null);

  useLayoutEffect(() => {
    // 1. Create Stave
    const stave = new VexStave(x, y, width);
    
    // 2. Add Modifiers
    if (clef) stave.addClef(clef);
    if (timeSignature) stave.addTimeSignature(timeSignature);

    // 3. Draw immediately
    stave.setContext(context).draw();

    setStaveVal({ stave, width });
  }, [context, x, y, width, clef, timeSignature]);

  return (
    <>
      {staveVal && (
        <StaveContext.Provider value={staveVal}>
          {children}
        </StaveContext.Provider>
      )}
    </>
  );
};