import {ThemeProvider as MuiProvider} from '@mui/material/styles';
import {StyleSheet} from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import {useNavigate, useParams} from 'react-router-dom';
import Card from '../components/Card';
import CenterModal from '../components/CenterModal';
import sharedStyles from '../components/sharedStyles';
import {useBoard} from '../data/boards';
import useColorSchemeTheme, {
  usePaperColorSchemeTheme,
} from '../theme/useColorSchemeTheme';

export default function BaseModalScreen({backTo, children}) {
  if (!backTo) {
    throw new Error('BaseModalScreen: backTo prop is required');
  }

  const navigate = useNavigate();
  const {boardId} = useParams();

  const {data: board} = useBoard(boardId);

  const colorTheme = useColorSchemeTheme(board?.attributes['color-theme']);
  const paperColorTheme = usePaperColorSchemeTheme(
    board?.attributes['color-theme'],
  );

  // TODO: what is the correct back behavior we want here?
  return (
    <PaperProvider theme={paperColorTheme}>
      <MuiProvider theme={colorTheme}>
        <ModalScreenWrapper closeModal={() => navigate(backTo)}>
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
