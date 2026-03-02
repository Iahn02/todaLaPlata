const tintColorLight = '#f3701e'; // Naranja retro
const tintColorDark = '#f3701e';

export default {
  light: {
    text: '#1a1a1a',
    background: '#f5f0eb',
    tint: tintColorLight,
    tabIconDefault: '#6b6b6b',
    tabIconSelected: tintColorLight,
    card: '#ffffff',
    border: '#e8d8c9',
  },
  dark: {
    text: '#f5f0eb',
    background: '#1a1a1a',
    tint: tintColorDark,
    tabIconDefault: '#9a9a9a',
    tabIconSelected: tintColorDark,
    card: '#2a2a2a',
    border: '#3d3d3d',
  },
} as const;
