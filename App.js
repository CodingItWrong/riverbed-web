import {ThemeProvider as MuiProvider} from '@mui/material/styles';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider as DateLocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import {Provider as PaperProvider} from 'react-native-paper';
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
});

export default function App() {
  const theme = useColorSchemeTheme();
  const paperTheme = usePaperColorSchemeTheme();

  return (
    <CurrentBoardProvider>
      <TokenProvider>
        <TokenLoadBuffer>
          <PaperProvider theme={paperTheme}>
            <MuiProvider theme={theme}>
              <DateLocalizationProvider dateAdapter={AdapterDayjs}>
                <QueryClientProvider client={queryClient}>
                  {__DEV__ && <ReactQueryDevtools initialIsOpen={false} />}
                  <Navigation />
                </QueryClientProvider>
              </DateLocalizationProvider>
            </MuiProvider>
          </PaperProvider>
        </TokenLoadBuffer>
      </TokenProvider>
    </CurrentBoardProvider>
  );
}
