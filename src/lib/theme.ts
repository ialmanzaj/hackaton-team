export const THEMES = {
  default: { bg: '#000000', text: '#FF2A2A' }, // Assuming default was black BG from clarification
  white: { bg: '#FFFFFF', text: '#FF2A2A' }   // New theme from PRD
} as const;

export type ThemeName = keyof typeof THEMES;
export type Theme = (typeof THEMES)[ThemeName]; 