import {useCallback, useEffect, useState} from 'react';
import {Outlet, useNavigate, useParams} from 'react-router-dom';
import BackButton from '../../components/BackButton';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import ErrorSnackbar from '../../components/ErrorSnackbar';
import IconButton from '../../components/IconButton';
import LoadingIndicator from '../../components/LoadingIndicator';
import sharedStyles from '../../components/sharedStyles';
import {useBoard} from '../../data/boards';
import {useCard, useDeleteCard} from '../../data/cards';
import BaseModalScreen from '../BaseModalScreen';
import EditCardForm from './EditCardForm';
import ElementList from './ElementList';

export default function CardScreen() {
  const {boardId, cardId} = useParams();
  const navigate = useNavigate();
  const [isEditingElements, setIsEditingElements] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

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
    navigate(`/boards/${boardId}`);
  }, [navigate, boardId]);

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
        <div>
          <IconButton
            icon="wrench"
            accessibilityLabel="Edit Elements"
            onClick={() => setIsEditingElements(on => !on)}
          />
          <IconButton
            icon="delete"
            accessibilityLabel="Delete Card"
            onClick={() => setConfirmingDelete(true)}
          />
        </div>
      );
    }
  }, [isEditingElements, handleDeleteCard]);

  function renderContents() {
    if (isFirstLoaded) {
      return <LoadingIndicator />;
    } else if (isEditingElements) {
      return <ElementList board={board} card={card} />;
    } else if (card) {
      return <EditCardForm card={card} board={board} onClose={closeModal} />;
    } else {
      return null;
    }
  }

  const backPath = `/boards/${boardId}`;

  return (
    <>
      <ConfirmationDialog
        destructive
        open={confirmingDelete}
        title="Delete Card?"
        message="Are you sure you want to delete this card?"
        confirmButtonLabel="Yes, Delete Card"
        onConfirm={handleDeleteCard}
        onDismiss={() => setConfirmingDelete(false)}
      />
      <BaseModalScreen backTo={backPath}>
        <div style={sharedStyles.headerRow}>
          <BackButton to={backPath} accessibilityLabel="Close card" />
          {renderButtonControls()}
        </div>
        {renderContents()}
      </BaseModalScreen>
      <ErrorSnackbar error={deleteError}>
        An error occurred deleting the card.
      </ErrorSnackbar>
      <Outlet />
    </>
  );
}
