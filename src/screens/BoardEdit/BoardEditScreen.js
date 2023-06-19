import {useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {Appbar} from 'react-native-paper';
import LoadingIndicator from '../../components/LoadingIndicator';
import {useBoard} from '../../data/boards';
import {useCurrentBoard} from '../../data/currentBoard';
import BaseModalScreen from '../BaseModalScreen';
import EditBoardForm from './EditBoardForm';

export default function BoardEditScreen() {
  const navigation = useNavigation();
  const {boardId} = useCurrentBoard();

  const {data: board} = useBoard(boardId);

  const closeModal = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  function renderContents() {
    if (!board) {
      return <LoadingIndicator />;
    } else {
      return (
        <EditBoardForm
          board={board}
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
        <Appbar.BackAction
          onPress={closeModal}
          accessibilityLabel="Close board edit form"
        />
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
