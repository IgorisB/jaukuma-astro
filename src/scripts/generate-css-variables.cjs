#!/usr/bin/env node
// Script to generate CSS custom properties from color constants
const { writeFileSync } = require('fs');
const { join } = require('path');

// Define the CSS variables based on the current values in colors.ts
const CSS_COLOR_VARS = {
  // Main colors
  '--color-main-primary': '#333F48',
  '--color-main-primary-light': '#4A5A66',
  '--color-main-primary-dark': '#1A2229',
  '--color-main-secondary': '#D6D2C4',
  '--color-main-secondary-light': '#EBE9E0',
  '--color-main-secondary-dark': '#BFB9A9',
  
  // Additional colors
  '--color-additional-red': '#A45248',
  '--color-additional-blue': '#166886',
  '--color-additional-green': '#6A7866',
  
  // Auxiliary colors
  '--color-aux-cream': '#EFDBB2',
  '--color-aux-peach': '#EACBBB',
  '--color-aux-mint': '#BFCEC2',
  '--color-aux-sky': '#B9C9CC',
  '--color-aux-tan': '#BAA58D',
  
  // Lighter grade of secondary color
  '--color-light': '#F3F1E8',
};

// Generate CSS custom properties string
const cssVariables = Object.entries(CSS_COLOR_VARS).map(
  ([name, value]) => `  ${name}: ${value};`
).join('\n');

// Create the complete CSS content
const cssContent = `/* AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY */
/* Generated from src/lib/colors.ts */

:root {
${cssVariables}
}
`;

// Write to a file that can be imported in global.css
const outputPath = join(__dirname, '../styles/generated-colors.css');
writeFileSync(outputPath, cssContent);

console.log('CSS variables generated successfully at:', outputPath);