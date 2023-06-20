import {useNavigation} from '@react-navigation/native';
import {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import BackButton from '../../components/BackButton';
import ErrorSnackbar from '../../components/ErrorSnackbar';
import IconButton from '../../components/IconButton';
import LoadingIndicator from '../../components/LoadingIndicator';
import sharedStyles from '../../components/sharedStyles';
import {useBoard} from '../../data/boards';
import {useCard, useDeleteCard} from '../../data/cards';
import {useCurrentBoard} from '../../data/currentBoard';
import BaseModalScreen from '../BaseModalScreen';
import EditCardForm from './EditCardForm';
import ElementList from './ElementList';

export default function CardScreen({route}) {
  const {boardId} = useCurrentBoard();
  const {cardId} = route.params;
  const navigation = useNavigation();
  const [isEditingElements, setIsEditingElements] = useState(false);

  // we use this instead of isLoading or isFetching because we do need the individual card to be newly loaded (so we need to wait on fetching), but we don't want to re-trigger the loading indicator any time we click back into the browser to fetch
  const [isFirstLoaded, setIsFirstLoaded] = useState(true);

  const {data: board} = useBoard(boardId);
  const {data: card} = useCard({boardId, cardId});

  useEffect(() => {
    if (card) {
      // do not do this in useCard onSuccess because we want it to happen even if the card is cached
      setIsFirstLoaded(false);
    }
  }, [card]);

  const closeModal = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const {mutate: deleteCard, error: deleteError} = useDeleteCard(card, board);
  const handleDeleteCard = useCallback(
    () => deleteCard(null, {onSuccess: closeModal}),
    [closeModal, deleteCard],
  );

  const renderButtonControls = useCallback(() => {
    if (isEditingElements) {
      return (
        <IconButton
          icon="check-bold"
          accessibilityLabel="Done Editing Elements"
          onClick={() => setIsEditingElements(on => !on)}
        />
      );
    } else {
      return (
        <>
          <IconButton
            icon="wrench"
            accessibilityLabel="Edit Elements"
            onClick={() => setIsEditingElements(on => !on)}
          />
          <IconButton
            icon="delete"
            accessibilityLabel="Delete Card"
            onClick={handleDeleteCard}
          />
        </>
      );
    }
  }, [isEditingElements, handleDeleteCard]);

  function renderContents() {
    if (isFirstLoaded) {
      return <LoadingIndicator />;
    } else if (isEditingElements) {
      return (
        <View style={[styles.container, sharedStyles.fill]}>
          <ElementList board={board} />
        </View>
      );
    } else if (card) {
      return <EditCardForm card={card} board={board} onClose={closeModal} />;
    } else {
      return null;
    }
  }

  return (
    <>
      <BaseModalScreen>
        <View style={styles.headerRow}>
          <BackButton accessibilityLabel="Close card" />
          <View style={sharedStyles.spacer} />
          {renderButtonControls()}
        </View>
        {renderContents()}
      </BaseModalScreen>
      <ErrorSnackbar error={deleteError}>
        An error occurred deleting the card.
      </ErrorSnackbar>
    </>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
