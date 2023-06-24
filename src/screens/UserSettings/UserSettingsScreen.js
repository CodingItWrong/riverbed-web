import {useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import BackButton from '../../components/BackButton';
import LoadingIndicator from '../../components/LoadingIndicator';
import sharedStyles from '../../components/sharedStyles';
import {useCurrentUser} from '../../data/user';
import BaseModalScreen from '../BaseModalScreen';
import EditSettingsForm from './EditSettingsForm';

export default function UserSettingsScreen() {
  const navigate = useNavigate();

  const {data: user} = useCurrentUser();

  const closeModal = useCallback(() => {
    navigate('/boards');
  }, [navigate]);

  function renderContents() {
    if (!user) {
      return <LoadingIndicator />;
    } else {
      return (
        <EditSettingsForm
          user={user}
          onSave={closeModal}
          onCancel={closeModal}
        />
      );
    }
  }

  const backPath = '/';

  return (
    <BaseModalScreen backTo={backPath}>
      <div style={sharedStyles.headerRow}>
        <BackButton to={backPath} accessibilityLabel="Close user settings" />
      </div>
      {renderContents()}
    </BaseModalScreen>
  );
}
