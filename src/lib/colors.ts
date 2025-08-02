// Color constants for the application
// All colors are defined as HEX values

export const COLORS = {
  // Main colors
  main: {
    primary: '#333F48',    // Dark blue-gray
    secondary: '#D6D2C4',  // Light beige
  },

  // Additional colors
  additional: {
    red: '#A45248',        // Rust red
    blue: '#166886',       // Steel blue
    green: '#6A7866',      // Sage green
  },

  // Auxiliary colors
  aux: {
    cream: '#EFDBB2',      // Light cream
    peach: '#EACBBB',      // Peach
    mint: '#BFCEC2',       // Mint green
    sky: '#B9C9CC',        // Sky blue
    tan: '#BAA58D',        // Tan
  },
} as const;

// CSS custom properties for use in stylesheets
export const CSS_COLOR_VARS = {
  // Main colors
  '--color-main-primary': COLORS.main.primary,
  '--color-main-secondary': COLORS.main.secondary,
  
  // Additional colors
  '--color-additional-red': COLORS.additional.red,
  '--color-additional-blue': COLORS.additional.blue,
  '--color-additional-green': COLORS.additional.green,
  
  // Auxiliary colors
  '--color-aux-cream': COLORS.aux.cream,
  '--color-aux-peach': COLORS.aux.peach,
  '--color-aux-mint': COLORS.aux.mint,
  '--color-aux-sky': COLORS.aux.sky,
  '--color-aux-tan': COLORS.aux.tan,
} as const;

// Type definitions for better TypeScript support
export type ColorCategory = keyof typeof COLORS;
export type MainColors = keyof typeof COLORS.main;
export type AdditionalColors = keyof typeof COLORS.additional;
export type AuxColors = keyof typeof COLORS.aux; 