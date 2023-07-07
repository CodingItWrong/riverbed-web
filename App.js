import {CssBaseline} from '@mui/material';
import {ThemeProvider as MuiProvider} from '@mui/material/styles';
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

      // for debugging:
      // refetchOnWindowFocus: false,
      // retry: false,
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
          <QueryClientProvider client={queryClient}>
            {__DEV__ && (
              <ReactQueryDevtools
                initialIsOpen={false}
                position="bottom-right"
              />
            )}
            <Navigation />
          </QueryClientProvider>
        </MuiProvider>
      </TokenLoadBuffer>
    </TokenProvider>
  );
}
