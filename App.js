import {
  QueryClient,
  QueryClientProvider,
  focusManager,
} from '@tanstack/react-query';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import {useEffect} from 'react';
import {AppState, Platform, StatusBar} from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import {en, registerTranslation} from 'react-native-paper-dates';
import CardList from './src/screens/CardList';

registerTranslation('en', en);

const queryClient = new QueryClient();

dayjs.extend(utc);
dayjs.extend(timezone);

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
