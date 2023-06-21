import {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {useNavigate} from 'react-router-dom';
import BackButton from '../../components/BackButton';
import LoadingIndicator from '../../components/LoadingIndicator';
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
          onDelete={closeModal}
          onCancel={closeModal}
        />
      );
    }
  }

  const backPath = '/';

  return (
    <BaseModalScreen backTo={backPath}>
      <View style={styles.headerRow}>
        <BackButton to={backPath} accessibilityLabel="Close user settings" />
      </View>
      {renderContents()}
    </BaseModalScreen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
  },
});
