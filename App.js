import {ThemeProvider as MuiProvider} from '@mui/material/styles';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider as DateLocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import {useEffect} from 'react';
import {AppState, Platform} from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Navigation from './src/Navigation';
import TokenLoadBuffer from './src/components/TokenLoadBuffer';
import {CurrentBoardProvider} from './src/data/currentBoard';
import {TokenProvider} from './src/data/token';
import useColorSchemeTheme, {
  usePaperColorSchemeTheme,
} from './src/theme/useColorSchemeTheme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: !window.Cypress,
      staleTime: 5000,
    },
  },
  logger: {
    log: console.log,
    warn: console.warn,
    error: Platform.OS === 'web' ? console.error : () => {},
  },
});

function onAppStateChange(status) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

export default function App() {
  const theme = useColorSchemeTheme();
  const paperTheme = usePaperColorSchemeTheme();

  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange);

    return () => subscription.remove();
  }, []);

  return (
    <CurrentBoardProvider>
      <TokenProvider>
        <TokenLoadBuffer>
          <SafeAreaProvider>
            <PaperProvider theme={paperTheme}>
              <MuiProvider theme={theme}>
                <DateLocalizationProvider dateAdapter={AdapterDayjs}>
                  <QueryClientProvider client={queryClient}>
                    {Platform.OS === 'web' && __DEV__ && (
                      <ReactQueryDevtools initialIsOpen={false} />
                    )}
                    <Navigation />
                  </QueryClientProvider>
                </DateLocalizationProvider>
              </MuiProvider>
            </PaperProvider>
          </SafeAreaProvider>
        </TokenLoadBuffer>
      </TokenProvider>
    </CurrentBoardProvider>
  );
}
