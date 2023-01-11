import {
  QueryClient,
  QueryClientProvider,
  focusManager,
} from '@tanstack/react-query';
import {useEffect} from 'react';
import {AppState, Platform, StatusBar} from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import CardList from './src/screens/CardList';

const queryClient = new QueryClient();

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
    <>
      <StatusBar barStyle="dark-content" />
      <PaperProvider>
        <QueryClientProvider client={queryClient}>
          <CardList />
        </QueryClientProvider>
      </PaperProvider>
    </>
  );
}
