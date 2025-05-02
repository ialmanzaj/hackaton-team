export const THEMES = {
  default: { bg: '#000000', text: '#ffffff' }, // Assuming default was black BG from clarification
  white: { bg: '#ffffff', text: '#000000' }   // New theme from PRD
} as const;

export type ThemeName = keyof typeof THEMES;
export type Theme = (typeof THEMES)[ThemeName]; 