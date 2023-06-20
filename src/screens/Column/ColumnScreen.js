import {useNavigation} from '@react-navigation/native';
import {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useNavigate, useParams} from 'react-router-dom';
import BackButton from '../../components/BackButton';
import LoadingIndicator from '../../components/LoadingIndicator';
import {useBoard} from '../../data/boards';
import {useColumn} from '../../data/columns';
import BaseModalScreen from '../BaseModalScreen';
import EditColumnForm from './EditColumnForm';

// TODO: fix double scroll
export default function ColumnScreen() {
  const navigate = useNavigate();
  const {boardId, columnId} = useParams();

  const {data: board} = useBoard(boardId);
  const {data: column} = useColumn({boardId, columnId});
  const [isFirstLoaded, setIsFirstLoaded] = useState(true);
  useEffect(() => {
    if (column) {
      // do not do this in useCard onSuccess because we want it to happen even if the card is cached
      setIsFirstLoaded(false);
    }
  }, [column]);

  const closeModal = useCallback(() => {
    navigate(`/boards/${boardId}`);
  }, [navigate, boardId]);

  function renderContents() {
    if (isFirstLoaded) {
      return <LoadingIndicator />;
    } else if (column) {
      return (
        <EditColumnForm
          column={column}
          board={board}
          onChange={closeModal}
          onCancel={closeModal}
        />
      );
    } else {
      return null;
    }
  }

  const backPath = `/boards/${boardId}`;

  return (
    <BaseModalScreen backTo={backPath}>
      <View style={styles.headerRow}>
        <BackButton to={backPath} accessibilityLabel="Close column" />
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
