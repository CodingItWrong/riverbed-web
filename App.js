import {
  QueryClient,
  QueryClientProvider,
  focusManager,
} from '@tanstack/react-query';
import {StatusBar} from 'expo-status-bar';
import {useEffect} from 'react';
import {AppState, Platform} from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import {en, registerTranslation} from 'react-native-paper-dates';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Navigation from './src/Navigation';
import TokenLoadBuffer from './src/components/TokenLoadBuffer';
import {TokenProvider} from './src/data/token';

registerTranslation('en', en);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: !window.Cypress,
    },
  },
});

function onAppStateChange(status) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

export default function App() {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange);

    return () => subscription.remove();
  }, []);

  return (
    <TokenProvider>
      <TokenLoadBuffer>
        <SafeAreaProvider>
          <StatusBar />
          <PaperProvider>
            <QueryClientProvider client={queryClient}>
              <Navigation />
            </QueryClientProvider>
          </PaperProvider>
        </SafeAreaProvider>
      </TokenLoadBuffer>
    </TokenProvider>
  );
}
