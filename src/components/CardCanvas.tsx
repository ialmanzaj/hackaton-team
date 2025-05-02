import React, { useRef, useEffect } from 'react';
import { THEMES, ThemeName } from '@/lib/theme'; // Assuming '@' alias maps to 'src'

// Constants based on PRD
const BASE_WIDTH = 1600;
const BASE_HEIGHT = 900;
const BOTTOM_TAG_TEXT_LEFT = 'ai-hackathon.co';
const BOTTOM_TAG_TEXT_RIGHT = '#LATAMACELERA';
const BOTTOM_TAG_HEIGHT = 40;
const SAFE_PADDING = 120; // Left/Right/Top padding
const FONT_FAMILY = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'; // With fallback

interface CardCanvasProps {
  theme: ThemeName;
  teamName: string;
  idea: string;
  lookingFor: string;
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
  const limitY = maxHeight ? maxHeight - lineHeight : Infinity; // Calculate limit considering line height

  for (let n = 0; n < words.length; n++) {
    if (currentY > limitY) break; // Stop if we exceed the max height

    const testLine = line + words[n] + ' ';
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
      if (currentY > limitY) { // Check again after incrementing Y
        line = '...'; // Indicate truncation if needed, or just break
        break;
      }
    } else {
      line = testLine;
    }
  }
  // Draw the last line only if it fits and wasn't truncated
  if (currentY <= limitY && line.trim() !== '...') {
    context.fillText(line, x, currentY);
    return currentY + lineHeight; // Return the Y position after the last line
  } else if (currentY <= limitY && line.trim() === '...') {
     context.fillText(line, x, currentY); // Draw ellipsis if needed
     return currentY + lineHeight; 
  }
  return currentY; // Return the Y position where it stopped
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
        console.log('Fonts ready, proceeding with drawing.');
      } catch (error) {
        console.error('Font loading failed:', error);
        // Optionally proceed with fallback fonts or show an error
      }

      // Resolve theme colors
      const currentTheme = THEMES[theme] ?? THEMES.default;
      const { bg: bgColor, text: textColor } = currentTheme;
      const headlineSize = fontSizes?.headline ?? 96;
      const lookingForSize = fontSizes?.lookingFor ?? 48;
      const maxContentHeight = BASE_HEIGHT - BOTTOM_TAG_HEIGHT;

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

      // 3. Draw idea text block (auto-fit, with maxHeight constraint)
      ctx.font = `700 ${headlineSize}px ${FONT_FAMILY}`;
      ctx.textAlign = 'left';
      const ideaMaxWidth = BASE_WIDTH - (SAFE_PADDING * 2);
      const ideaLineHeight = headlineSize * 1.2; 
      const ideaStartY = 240; 
      const ideaBlockBottom = wrapText(ctx, idea, SAFE_PADDING, ideaStartY, ideaMaxWidth, ideaLineHeight, maxContentHeight);

      // 4. Draw lookingFor line
      ctx.font = `400 ${lookingForSize}px ${FONT_FAMILY}`;
      ctx.textAlign = 'left';
      const lookingForY = ideaBlockBottom + 80;
      // Ensure lookingFor doesn't overlap bottom tag area (check against maxContentHeight)
      if (lookingForY < maxContentHeight - lookingForSize) {
        ctx.fillText(`Looking for: ${lookingFor}`, SAFE_PADDING, lookingForY);
      }

      // Draw Bottom Tags
      ctx.font = `600 24px ${FONT_FAMILY}`;
      ctx.fillStyle = '#FF2A2A'; // Always red
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