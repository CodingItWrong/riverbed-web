import {MD3DarkTheme, MD3LightTheme} from 'react-native-paper';
import useDebouncedColorScheme from './useDebouncedColorScheme';

const THEME_FOR_COLOR_SCHEME = {
  dark: MD3DarkTheme,
  light: MD3LightTheme,
};

export default function useColorSchemeTheme() {
  const colorScheme = useDebouncedColorScheme();
  return THEME_FOR_COLOR_SCHEME[colorScheme];
}
