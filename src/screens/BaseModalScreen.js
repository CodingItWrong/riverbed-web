import {useNavigation} from '@react-navigation/native';
import {Platform, StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Provider as PaperProvider} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Card from '../components/Card';
import CenterModal from '../components/CenterModal';
import ScreenBackground from '../components/ScreenBackground';
import sharedStyles from '../components/sharedStyles';
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
          <View style={Platform.OS === 'ios' && styles.container}>
            {children}
          </View>
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
        <Card style={styles.wrapperCard} contentStyle={sharedStyles.fill}>
          {children}
        </Card>
      </CenterModal>
    ),
    default: (
      <ScreenBackground>
        <View style={sharedStyles.fill}>{children}</View>
      </ScreenBackground>
    ),
  });
}

const styles = StyleSheet.create({
  wrapperCard: {
    marginTop: 8,
    maxHeight: '90%',
  },
  container: {
    padding: 16,
  },
});
