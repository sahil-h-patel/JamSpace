import { createContext } from 'react';
import { RenderContext, Renderer, Stave } from 'vexflow';

export const RendererContext = createContext<{
  context: RenderContext;
  renderer: Renderer;
} | null>(null);

export const StaveContext = createContext<{
  stave: Stave;
  width: number;
} | null>(null);