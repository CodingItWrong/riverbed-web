import {ThemeProvider as MuiProvider} from '@mui/material/styles';
import {useNavigation} from '@react-navigation/native';
import {StyleSheet, View} from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import Card from '../components/Card';
import CenterModal from '../components/CenterModal';
import sharedStyles from '../components/sharedStyles';
import {useBoard} from '../data/boards';
import {useCurrentBoard} from '../data/currentBoard';
import useColorSchemeTheme, {
  usePaperColorSchemeTheme,
} from '../theme/useColorSchemeTheme';

export default function BaseModalScreen({children}) {
  const navigation = useNavigation();
  const {boardId} = useCurrentBoard();

  const {data: board} = useBoard(boardId);

  const colorTheme = useColorSchemeTheme(board?.attributes['color-theme']);
  const paperColorTheme = usePaperColorSchemeTheme(
    board?.attributes['color-theme'],
  );

  return (
    <PaperProvider theme={paperColorTheme}>
      <MuiProvider theme={colorTheme}>
        <ModalScreenWrapper closeModal={() => navigation.goBack()}>
          {children}
        </ModalScreenWrapper>
      </MuiProvider>
    </PaperProvider>
  );
}

/**
 * Wrapper around a modal screen.
 * Provides extra styling for web as we don't get it by default.
 */
function ModalScreenWrapper({children, closeModal}) {
  return (
    <CenterModal onDismiss={closeModal}>
      <Card style={styles.wrapperCard} contentStyle={sharedStyles.fill}>
        {children}
      </Card>
    </CenterModal>
  );
}

const styles = StyleSheet.create({
  wrapperCard: {
    marginTop: 8,
    maxHeight: '90%',
    overflowY: 'auto',
  },
  container: {
    padding: 16,
  },
});
