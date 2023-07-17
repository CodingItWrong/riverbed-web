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

  return (
    <>
      <NavigationBar options={{title: 'Riverbed BETA'}} />
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
                <a href="https://about.riverbed.app">
                  Read the Riverbed Beta announcement!
                </a>
              </p>
              <p style={styles.link}>
                Get access to the{' '}
                <a href="https://testflight.apple.com/join/x2YeMEWe">
                  Riverbed beta on Apple platforms
                </a>{' '}
                (iOS, iPadOS, and macOS)
              </p>
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
