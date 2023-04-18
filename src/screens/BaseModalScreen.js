import {useNavigation} from '@react-navigation/native';
import {Platform, StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Provider as PaperProvider} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Card from '../components/Card';
import CenterModal from '../components/CenterModal';
import ScreenBackground from '../components/ScreenBackground';
import {useBoard} from '../data/boards';
import {useCurrentBoard} from '../data/currentBoard';
import useColorSchemeTheme from '../theme/useColorSchemeTheme';

export default function BaseModalScreen({children}) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const {boardId} = useCurrentBoard();

  const {data: board} = useBoard(boardId);

  const colorTheme = useColorSchemeTheme(board?.attributes['color-theme']);

  return (
    <PaperProvider theme={colorTheme}>
      <ModalScreenWrapper closeModal={() => navigation.goBack()}>
        <KeyboardAwareScrollView
          contentContainerStyle={{paddingBottom: insets.bottom}}
          scrollIndicatorInsets={{bottom: insets.bottom}}
          extraHeight={EXPERIMENTAL_EXTRA_HEIGHT}
        >
          {children}
        </KeyboardAwareScrollView>
      </ModalScreenWrapper>
    </PaperProvider>
  );
}

const EXPERIMENTAL_EXTRA_HEIGHT = 150;

/**
 * Wrapper around a modal screen.
 * Provides extra styling for web as we don't get it by default.
 */
function ModalScreenWrapper({children, closeModal}) {
  return Platform.select({
    web: (
      <CenterModal onDismiss={closeModal}>
        <Card style={styles.wrapperCard} contentStyle={styles.cardContent}>
          {children}
        </Card>
      </CenterModal>
    ),
    default: (
      <ScreenBackground>
        <View style={styles.container}>{children}</View>
      </ScreenBackground>
    ),
  });
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  wrapperCard: {
    marginTop: 8,
    maxHeight: '90%',
  },
  cardContent: {
    flex: 1,
  },
});
