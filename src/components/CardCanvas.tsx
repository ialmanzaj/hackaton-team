import React, { useRef, useEffect } from 'react';
import { THEMES, ThemeName } from '@/lib/theme'; // Assuming '@' alias maps to 'src'

// Constants based on PRD
const BASE_WIDTH = 1600;
const BASE_HEIGHT = 900;
const BOTTOM_TAG_TEXT_LEFT = 'ai-hackathon.co';
const BOTTOM_TAG_TEXT_RIGHT = '#LATAMACELERA';
const BOTTOM_TAG_HEIGHT = 80;
const SAFE_PADDING = 120; // Left/Right/Top padding
const FONT_FAMILY = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'; // With fallback

interface CardCanvasProps {
  theme: ThemeName;
  teamName: string;
  idea: string;
  lookingFor?: string;
  fontSizes?: {
    headline: number;
    lookingFor: number;
  };
}

// Helper function for text wrapping (Updated with maxHeight)
function wrapText(context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number, maxHeight?: number): number {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  // Adjust limit calculation to use the actual bottom edge based on maxHeight
  const limitY = maxHeight ? maxHeight : Infinity;

  for (let n = 0; n < words.length; n++) {
    // Check if adding the next line *would* exceed the limit
    // Also ensure we don't break immediately if the first line itself is too long
    if (currentY + lineHeight > limitY && line !== '' && n > 0) break;

    const testLine = line + words[n] + ' ';
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
      // Check *again* after incrementing Y to prevent drawing below limitY
      if (currentY + lineHeight > limitY) {
        // Draw the last fitting line and indicate truncation
        if (currentY <= limitY) {
          context.fillText(line.trim() + '...', x, currentY);
        } else {
          // If even the previous line didn't fit, we might need different handling,
          // but for now, break and rely on the final check.
        }
        line = ''; // Clear line as we've drawn truncated text
        break;
      }
    } else {
      line = testLine;
    }
  }
  // Draw the final line if it wasn't truncated and fits
  if (line !== '' && currentY + lineHeight <= limitY) {
    context.fillText(line.trim(), x, currentY);
    return currentY + lineHeight; // Return the Y position *after* the last drawn line
  } else if (line !== '' && currentY <= limitY) {
    // If the line technically fits but adding lineHeight would exceed, draw it without advancing Y
    context.fillText(line.trim(), x, currentY);
    return currentY; // Return current Y as it's the bottom
  }

  // If loop finished or broke due to height limit, return the Y where it stopped
  // (This could be the start Y if the first line didn't fit)
  return currentY;
}

const CardCanvas: React.FC<CardCanvasProps> = ({
  theme = 'default', // Add default theme value
  teamName,
  idea,
  lookingFor,
  fontSizes
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const drawCanvas = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      try {
        // --- Font Loading Check ---
        await document.fonts.ready; // Wait for 'Inter' (and others) to be ready
        console.log('Fuentes listas, procediendo a dibujar.'); // Spanish translation
      } catch (error) {
        console.error('Error al cargar fuentes:', error); // Spanish translation
        // Optionally proceed with fallback fonts or show an error
      }

      // Resolve theme colors
      const currentTheme = THEMES[theme] ?? THEMES.default;
      const { bg: bgColor, text: textColor } = currentTheme;
      const headlineSize = fontSizes?.headline ?? 96;
      const lookingForSize = fontSizes?.lookingFor ?? 48;
      // Calculate the maximum Y coordinate for *all* content, respecting top padding and bottom tag height
      const maxContentY = BASE_HEIGHT - BOTTOM_TAG_HEIGHT - SAFE_PADDING;

      // --- Drawing Logic from PRD (Updated) ---

      // 1. Fill background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);

      // Base text settings
      ctx.fillStyle = textColor;
      ctx.textBaseline = 'top'; // Consistent baseline

      // 2. Draw team name (Updated: top-left)
      ctx.font = `bold 20px ${FONT_FAMILY}`;
      ctx.textAlign = 'left'; // Updated alignment
      ctx.fillText(teamName, SAFE_PADDING, SAFE_PADDING); // Updated position

      // 3. Draw idea text block (auto-fit, respecting maxContentY)
      ctx.font = `700 ${headlineSize}px ${FONT_FAMILY}`;
      ctx.textAlign = 'left';
      const ideaMaxWidth = BASE_WIDTH - (SAFE_PADDING * 2);
      const ideaLineHeight = headlineSize * 1.2;
      // Start idea text below the team name + some spacing, but respect SAFE_PADDING
      const ideaStartY = SAFE_PADDING + 20 + 40; // Team name height + spacing, ensure >= SAFE_PADDING
      // Pass the calculated maxContentY to wrapText
      const ideaBlockBottom = wrapText(ctx, idea, SAFE_PADDING, ideaStartY, ideaMaxWidth, ideaLineHeight, maxContentY);

      // 4. Draw lookingFor line (conditionally)
      if (lookingFor && lookingFor.trim() !== '') { // Check if lookingFor is provided and not empty
        ctx.font = `400 ${lookingForSize}px ${FONT_FAMILY}`;
        ctx.textAlign = 'left';
        const lookingForY = ideaBlockBottom + 80; // Spacing below idea block
        // Ensure lookingFor line itself doesn't start below maxContentY
        if (lookingForY < maxContentY) {
          // Also check if the *bottom* of the lookingFor line would exceed maxContentY
          if (lookingForY + lookingForSize <= maxContentY) {
            ctx.fillText(`Buscando: ${lookingFor}`, SAFE_PADDING, lookingForY); // Spanish translation
          } else {
            console.warn("Texto 'Buscando' truncado por falta de espacio."); // Spanish translation
            // Optionally draw truncated text or nothing
          }
        } else {
          console.warn("Texto 'Buscando' omitido completamente por falta de espacio."); // Spanish translation
        }
      } // End conditional rendering for lookingFor

      // Draw Bottom Tags
      ctx.font = `600 24px ${FONT_FAMILY}`;
      ctx.fillStyle = textColor; // Use theme text color, not hardcoded red
      ctx.textBaseline = 'middle'; // Align vertically in the bar
      const safeBottom = BASE_HEIGHT - BOTTOM_TAG_HEIGHT;
      const tagY = safeBottom + (BOTTOM_TAG_HEIGHT / 2); // Center vertically

      // Left Tag
      ctx.textAlign = 'left';
      ctx.fillText(BOTTOM_TAG_TEXT_LEFT, SAFE_PADDING, tagY);

      // Right Tag
      ctx.textAlign = 'right';
      ctx.fillText(BOTTOM_TAG_TEXT_RIGHT, BASE_WIDTH - SAFE_PADDING, tagY);

    };

    drawCanvas();

  }, [theme, teamName, idea, lookingFor, fontSizes]); // Dependencies for redraw

  return (
    <canvas
      ref={canvasRef}
      width={BASE_WIDTH}
      height={BASE_HEIGHT}
      // Basic styling for display - ensures correct aspect ratio
      style={{ width: '100%', height: 'auto', aspectRatio: `${BASE_WIDTH}/${BASE_HEIGHT}`, maxWidth: `${BASE_WIDTH}px`, display: 'block' }}
    />
  );
};

export default CardCanvas; 