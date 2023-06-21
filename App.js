import {CssBaseline} from '@mui/material';
import {ThemeProvider as MuiProvider} from '@mui/material/styles';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider as DateLocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import Navigation from './src/Navigation';
import TokenLoadBuffer from './src/components/TokenLoadBuffer';
import {TokenProvider} from './src/data/token';
import useColorSchemeTheme from './src/theme/useColorSchemeTheme';

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

  return (
    <TokenProvider>
      <TokenLoadBuffer>
        <MuiProvider theme={theme}>
          <CssBaseline />
          <DateLocalizationProvider dateAdapter={AdapterDayjs}>
            <QueryClientProvider client={queryClient}>
              {__DEV__ && <ReactQueryDevtools initialIsOpen={false} />}
              <Navigation />
            </QueryClientProvider>
          </DateLocalizationProvider>
        </MuiProvider>
      </TokenLoadBuffer>
    </TokenProvider>
  );
}
