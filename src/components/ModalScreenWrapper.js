import {Platform, ScrollView, StyleSheet} from 'react-native';
import Card from './Card';
import CenterModal from './CenterModal';
import ScreenBackground from './ScreenBackground';

/**
 * Wrapper around a modal screen.
 * Provides extra styling for web as we don't get it by default.
 */
export default function ModalScreenWrapper({children, closeModal}) {
  return Platform.select({
    web: (
      <CenterModal onDismiss={closeModal}>
        <Card style={styles.wrapperCard} contentStyle={styles.cardContent}>
          <ScrollView>{children}</ScrollView>
        </Card>
      </CenterModal>
    ),
    default: <ScreenBackground>{children}</ScreenBackground>,
  });
}

const styles = StyleSheet.create({
  wrapperCard: {
    marginTop: 8,
    maxHeight: '90%',
  },
  cardContent: {
    flex: 1,
  },
});
