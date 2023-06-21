import {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {useNavigate} from 'react-router-dom';
import oauthLogin from '../../auth/oauthLogin';
import useLoginForm from '../../auth/useLoginForm';
import Button from '../../components/Button';
import CenterColumn from '../../components/CenterColumn';
import ErrorMessage from '../../components/ErrorMessage';
import NavigationBar from '../../components/NavigationBar';
import ScreenBackground from '../../components/ScreenBackground';
import TextField from '../../components/TextField';
import sharedStyles from '../../components/sharedStyles';
import httpClient from '../../data/httpClient';
import {useToken} from '../../data/token';

const client = httpClient();

export default function SignIn({navigation}) {
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

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/boards');
    }
  }, [isLoggedIn, navigate]);

  return (
    <>
      <NavigationBar options={{title: 'Riverbed'}} />
      <ScreenBackground style={styles.container}>
        <CenterColumn>
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
          <Button mode="primary" onPress={handleLogIn} style={sharedStyles.mt}>
            Sign in
          </Button>
        </CenterColumn>
      </ScreenBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
