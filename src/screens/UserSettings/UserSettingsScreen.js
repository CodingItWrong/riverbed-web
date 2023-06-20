import {useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import BackButton from '../../components/BackButton';
import LoadingIndicator from '../../components/LoadingIndicator';
import {useCurrentUser} from '../../data/user';
import BaseModalScreen from '../BaseModalScreen';
import EditSettingsForm from './EditSettingsForm';

export default function UserSettingsScreen() {
  const navigation = useNavigation();

  const {data: user} = useCurrentUser();

  const closeModal = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  function renderContents() {
    if (!user) {
      return <LoadingIndicator />;
    } else {
      return (
        <EditSettingsForm
          user={user}
          onSave={closeModal}
          onDelete={() => navigation.popToTop()}
          onCancel={closeModal}
        />
      );
    }
  }

  return (
    <BaseModalScreen>
      <View style={styles.headerRow}>
        <BackButton accessibilityLabel="Close user settings" />
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
