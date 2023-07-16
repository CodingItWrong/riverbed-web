import {useState} from 'react';
import Button from '../../components/Button';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import DropdownField from '../../components/DropdownField';
import ErrorMessage from '../../components/ErrorMessage';
import Stack from '../../components/Stack';
import TextField from '../../components/TextField';
import {useCreateUser} from '../../data/user';
import {isValidEmail} from '../../utils/stringUtils';

export default function SignUpForm({onClose}) {
  const [attributes, setAttributes] = useState({
    email: '',
    password: '',
    'allow-emails': null,
  });
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState();
  const [isSuccess, setIsSuccess] = useState(false);

  const {mutate: createUser} = useCreateUser({
    onSuccess: () => setIsSuccess(true),
    onError: () =>
      setError(
        'An error occurred while creating your account. Please try again.',
      ),
  });
  function handleCreateUser(event) {
    event.preventDefault();

    if (attributes.email === '') {
      console.log('HI');
      setError('Email is required');
    } else if (!isValidEmail(attributes.email)) {
      setError('Email does not appear to be a valid email address');
    } else if (attributes.password === '') {
      setError('Password is required');
    } else if (attributes.password.length < 8) {
      setError('Password must be at least 8 characters');
    } else if (passwordConfirmation !== attributes.password) {
      setError('Passwords do not match');
    } else if (attributes['allow-emails'] === null) {
      setError('Please choose whether or not to allow emails');
    } else {
      createUser(attributes);
    }
  }

  const handleChangeAttribute = attribute => newValue => {
    setError(null);
    setAttributes(oldAttributes => ({...oldAttributes, [attribute]: newValue}));
  };

  const allowEmailsOptions = [
    {key: false, label: 'No'},
    {key: true, label: 'Yes'},
  ];

  return (
    <>
      <form onSubmit={handleCreateUser}>
        <Stack spacing={1}>
          <TextField
            label="Email"
            testID="text-input-new-email"
            value={attributes.email}
            onChangeText={handleChangeAttribute('email')}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect="off"
          />
          <TextField
            label="Password"
            testID="text-input-new-password"
            value={attributes.password}
            onChangeText={handleChangeAttribute('password')}
            secureTextEntry
          />
          <TextField
            label="Confirm Password"
            testID="text-input-confirm-new-password"
            value={passwordConfirmation}
            onChangeText={setPasswordConfirmation}
            secureTextEntry
          />
          <DropdownField
            fieldLabel="Allow important emails about your account?"
            emptyLabel="(choose)"
            value={attributes['allow-emails']}
            onValueChange={handleChangeAttribute('allow-emails')}
            options={allowEmailsOptions}
          />
          <ErrorMessage>{error}</ErrorMessage>
          <Button type="submit" mode="primary" testID="sign-up-submit-button">
            Sign up
          </Button>
        </Stack>
      </form>
      <ConfirmationDialog
        open={isSuccess}
        title="Account Created"
        message="Congratulations, your Riverbed account has been created! You can now log in with the username and password you provided."
        confirmButtonLabel="OK"
        onConfirm={onClose}
      />
    </>
  );
}
