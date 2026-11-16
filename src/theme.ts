import { useColorScheme } from 'react-native';

export type Colors = {
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  up: string;
  down: string;
  accent: string;
};

export const darkColors: Colors = {
  background: '#0B0D10',
  surface: '#16191E',
  text: '#F4F6F8',
  textMuted: '#9AA3AE',
  border: '#262B33',
  up: '#3EE0A1',
  down: '#FF6B6B',
  accent: '#3EE0A1',
};

export const lightColors: Colors = {
  background: '#FFFFFF',
  surface: '#F2F4F7',
  text: '#0B0D10',
  textMuted: '#5B6470',
  border: '#E1E5EA',
  up: '#077A55',
  down: '#C62828',
  accent: '#077A55',
};

export function useTheme(): Colors {
  return useColorScheme() === 'light' ? lightColors : darkColors;
}
