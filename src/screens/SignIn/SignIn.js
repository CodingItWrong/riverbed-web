import {StyleSheet} from 'react-native';
import oauthLogin from '../../auth/oauthLogin';
import useLoginForm from '../../auth/useLoginForm';
import Button from '../../components/Button';
import CenterColumn from '../../components/CenterColumn';
import ErrorMessage from '../../components/ErrorMessage';
import ScreenBackground from '../../components/ScreenBackground';
import TextField from '../../components/TextField';
import sharedStyles from '../../components/sharedStyles';
import httpClient from '../../data/httpClient';
import {useToken} from '../../data/token';

const client = httpClient();

export default function SignIn({navigation}) {
  const {setToken} = useToken();
  const onLogIn = ({username, password}) =>
    oauthLogin({
      httpClient: client,
      username,
      password,
    }).then(setToken);
  const {username, password, error, handleChange, handleLogIn} =
    useLoginForm(onLogIn);

  return (
    <ScreenBackground style={styles.container}>
      <CenterColumn>
        <TextField
          label="Email"
          testID="text-input-email"
          value={username}
          onChangeText={handleChange('username')}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
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
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
