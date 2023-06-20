import {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useNavigate, useParams} from 'react-router-dom';
import BackButton from '../../components/BackButton';
import LoadingIndicator from '../../components/LoadingIndicator';
import {useBoard} from '../../data/boards';
import {useBoardElement} from '../../data/elements';
import BaseModalScreen from '../BaseModalScreen';
import EditElementForm from './EditElementForm';

export default function ElementScreen() {
  const navigate = useNavigate();
  const {boardId, cardId, elementId} = useParams();

  const {data: board} = useBoard(boardId);
  const {data: element} = useBoardElement({boardId, elementId});
  const [isFirstLoaded, setIsFirstLoaded] = useState(true);
  useEffect(() => {
    if (element) {
      // do not do this in useCard onSuccess because we want it to happen even if the card is cached
      setIsFirstLoaded(false);
    }
  }, [element]);

  // TODO: does not go back to editing mode; maybe should be in the route
  const backPath = `/boards/${boardId}/cards/${cardId}`;

  const closeModal = useCallback(() => {
    navigate(backPath);
  }, [navigate, backPath]);

  function renderContents() {
    if (isFirstLoaded) {
      return <LoadingIndicator />;
    } else if (element) {
      return (
        <EditElementForm
          element={element}
          board={board}
          onSave={closeModal}
          onDelete={closeModal}
          onCancel={closeModal}
        />
      );
    } else {
      return null;
    }
  }

  return (
    <BaseModalScreen backTo={backPath}>
      <View style={styles.headerRow}>
        <BackButton to={backPath} accessibilityLabel="Close element" />
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
