import {useNavigate} from 'react-router-dom';
import BackButton from '../../components/BackButton';
import sharedStyles from '../../components/sharedStyles';
import BaseModalScreen from '../BaseModalScreen';
import SignUpForm from './SignUpForm';

export default function SignUp() {
  const navigate = useNavigate();

  const backPath = '/';

  return (
    <BaseModalScreen backTo={backPath}>
      <div style={sharedStyles.headerRow}>
        <BackButton to={backPath} accessibilityLabel="Cancel sign up" />
      </div>
      <SignUpForm onClose={() => navigate(backPath)} />
    </BaseModalScreen>
  );
}
