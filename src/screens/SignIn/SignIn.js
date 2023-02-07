import {SafeAreaView} from 'react-native-safe-area-context';
import oauthLogin from '../../auth/oauthLogin';
import useLoginForm from '../../auth/useLoginForm';
import Button from '../../components/Button';
import ScreenBackground from '../../components/ScreenBackground';
import Text from '../../components/Text';
import TextField from '../../components/TextField';
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
    <ScreenBackground>
      <SafeAreaView>
        <TextField
          label="Email"
          value={username}
          onChangeText={handleChange('username')}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextField
          label="Password"
          value={password}
          onChangeText={handleChange('password')}
          secureTextEntry
        />
        <Text>{error}</Text>
        <Button mode="contained" onPress={handleLogIn}>
          Sign in
        </Button>
      </SafeAreaView>
    </ScreenBackground>
  );
}
