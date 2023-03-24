import {colorThemes} from './colorThemes';
import useDebouncedColorScheme from './useDebouncedColorScheme';

export default function useColorSchemeTheme(colorTheme) {
  const colorScheme = useDebouncedColorScheme();
  return colorThemes[colorTheme ?? 'default'][colorScheme];
}
