import {useMediaQuery} from '@mui/material';
import {useEffect} from 'react';
import {Outlet, Link as RouterLink, useNavigate} from 'react-router-dom';
import oauthLogin from '../../auth/oauthLogin';
import useLoginForm from '../../auth/useLoginForm';
import Button from '../../components/Button';
import CenterColumn from '../../components/CenterColumn';
import ErrorMessage from '../../components/ErrorMessage';
import NavigationBar from '../../components/NavigationBar';
import ScreenBackground from '../../components/ScreenBackground';
import Stack from '../../components/Stack';
import TextField from '../../components/TextField';
import httpClient from '../../data/httpClient';
import {useToken} from '../../data/token';

const client = httpClient();

export default function SignIn() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const {isLoggedIn, setToken} = useToken();
  const navigate = useNavigate();
  const onLogIn = ({username, password}) =>
    oauthLogin({
      httpClient: client,
      username,
      password,
    }).then(setToken);
  const {username, password, error, handleChange, handleLogIn} =
    useLoginForm(onLogIn);

  function handleSubmit(e) {
    e.preventDefault();
    handleLogIn();
  }

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/boards');
    }
  }, [isLoggedIn, navigate]);

  const appStoreBadgeColor = prefersDarkMode ? 'white' : 'black';

  return (
    <>
      <NavigationBar options={{title: 'Riverbed'}} />
      <ScreenBackground style={styles.container}>
        <CenterColumn>
          <form onSubmit={handleSubmit}>
            <Stack spacing={1}>
              <TextField
                label="Email"
                testID="text-input-email"
                value={username}
                onChangeText={handleChange('username')}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect="off"
              />
              <TextField
                label="Password"
                testID="text-input-password"
                value={password}
                onChangeText={handleChange('password')}
                secureTextEntry
              />
              <ErrorMessage>{error}</ErrorMessage>
              <Button type="submit" mode="primary">
                Sign in
              </Button>
              <Button
                type="button"
                mode="secondary"
                component={RouterLink}
                href="/sign-up"
              >
                Sign up
              </Button>
              <p style={styles.link}>
                Riverbed allows you to build mini-apps that let you interact
                with your data the way that works best for you—all without
                writing any code.{' '}
                <a href="https://about.riverbed.app">Learn More</a>
              </p>
              <div style={styles.link}>
                <a
                  href="https://apps.apple.com/us/app/riverbed-info-management/id6448536545"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={`/ios-app-store-${appStoreBadgeColor}.svg`}
                    alt="Download on the App Store"
                    target="_blank"
                  />
                </a>{' '}
                <a
                  href="https://apps.apple.com/us/app/riverbed-info-management/id6448536545"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={`/mac-app-store-${appStoreBadgeColor}.svg`}
                    alt="Download on the Mac App Store"
                  />
                </a>
              </div>
            </Stack>
          </form>
        </CenterColumn>
      </ScreenBackground>
      <Outlet />
    </>
  );
}

const styles = {
  container: {
    padding: 16,
  },
  link: {
    textAlign: 'center',
  },
};
