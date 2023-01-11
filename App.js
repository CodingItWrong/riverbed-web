import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {StatusBar} from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import CardList from './src/screens/CardList';

const queryClient = new QueryClient();

export default function App() {
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
