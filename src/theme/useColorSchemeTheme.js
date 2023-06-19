import {createTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useMemo} from 'react';
import {colorThemes as paperColorThemes} from './colorThemes';
import {primaryColors} from './primaryColors';
import useDebouncedColorScheme from './useDebouncedColorScheme';

export default function useColorSchemeTheme(colorTheme) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(() => {
    const primaryColor = primaryColors[colorTheme ?? 'default'];
    console.log({primaryColor});
    return createTheme({
      palette: {
        primary: {
          main: primaryColor,
        },
        mode: prefersDarkMode ? 'dark' : 'light',
      },
    });
  }, [colorTheme, prefersDarkMode]);

  return theme;
}

export function usePaperColorSchemeTheme(colorTheme) {
  const colorScheme = useDebouncedColorScheme();
  return paperColorThemes[colorTheme ?? 'default'][colorScheme];
}
