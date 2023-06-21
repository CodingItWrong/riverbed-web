import {createTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useMemo} from 'react';
import {primaryColors} from './primaryColors';

export default function useColorSchemeTheme(colorTheme) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(() => {
    const primaryColor = primaryColors[colorTheme ?? 'default'];
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
