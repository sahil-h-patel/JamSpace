import React, { useRef, useState, useLayoutEffect } from 'react';
import { Renderer, RenderContext } from 'vexflow';
import { RendererContext } from './context';

interface ScoreProps {
  width?: number;
  height?: number;
  children: React.ReactNode;
}

export const Score = ({ width = 600, height = 200, children }: ScoreProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [contextVal, setContextVal] = useState<{ 
    context: RenderContext; 
    renderer: Renderer 
  } | null>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    // 1. Initialize Renderer
    containerRef.current.innerHTML = '';
    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
    renderer.resize(width, height);
    const context = renderer.getContext();

    // 2. Load Font
    context.setFont('Arial', 10);

    setContextVal({ context, renderer });
  }, [width, height]);

  return (
    <div ref={containerRef} style={{ display: 'inline-block' }}>
      {contextVal && (
        <RendererContext.Provider value={contextVal}>
          {children}
        </RendererContext.Provider>
      )}
    </div>
  );
};