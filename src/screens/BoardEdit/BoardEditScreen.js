import {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {useNavigate, useParams} from 'react-router-dom';
import BackButton from '../../components/BackButton';
import LoadingIndicator from '../../components/LoadingIndicator';
import {useBoard} from '../../data/boards';
import BaseModalScreen from '../BaseModalScreen';
import EditBoardForm from './EditBoardForm';

export default function BoardEditScreen() {
  const navigate = useNavigate();
  const {boardId} = useParams();

  const {data: board} = useBoard(boardId);

  const backPath = `/boards/${boardId}`;

  const closeModal = useCallback(() => {
    navigate(backPath);
  }, [navigate, backPath]);

  function renderContents() {
    if (!board) {
      return <LoadingIndicator />;
    } else {
      return (
        <EditBoardForm
          board={board}
          onSave={closeModal}
          onDelete={() => navigate('/')}
          onCancel={closeModal}
        />
      );
    }
  }

  return (
    <BaseModalScreen backTo={backPath}>
      <View style={styles.headerRow}>
        <BackButton to={backPath} accessibilityLabel="Close board edit form" />
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
