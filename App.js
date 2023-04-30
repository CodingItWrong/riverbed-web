import {
  QueryClient,
  QueryClientProvider,
  focusManager,
} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import {StatusBar} from 'expo-status-bar';
import {useEffect} from 'react';
import {AppState, Platform} from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import {en, registerTranslation} from 'react-native-paper-dates';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Navigation from './src/Navigation';
import TokenLoadBuffer from './src/components/TokenLoadBuffer';
import {CurrentBoardProvider} from './src/data/currentBoard';
import {TokenProvider} from './src/data/token';
import useColorSchemeTheme from './src/theme/useColorSchemeTheme';

registerTranslation('en', en);

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

  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange);

    return () => subscription.remove();
  }, []);

  return (
    <CurrentBoardProvider>
      <TokenProvider>
        <TokenLoadBuffer>
          <SafeAreaProvider>
            <StatusBar />
            <PaperProvider theme={theme}>
              <QueryClientProvider client={queryClient}>
                {Platform.OS === 'web' && __DEV__ && (
                  <ReactQueryDevtools initialIsOpen={false} />
                )}
                <Navigation />
              </QueryClientProvider>
            </PaperProvider>
          </SafeAreaProvider>
        </TokenLoadBuffer>
      </TokenProvider>
    </CurrentBoardProvider>
  );
}
