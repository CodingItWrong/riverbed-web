import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {StatusBar} from 'react-native';
import CardList from './src/screens/CardList';

const queryClient = new QueryClient();

export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <QueryClientProvider client={queryClient}>
        <CardList />
      </QueryClientProvider>
    </>
  );
}
