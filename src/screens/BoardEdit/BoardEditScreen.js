import {useCallback} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import BackButton from '../../components/BackButton';
import LoadingIndicator from '../../components/LoadingIndicator';
import sharedStyles from '../../components/sharedStyles';
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
      return (
        <div style={sharedStyles.firstLoadIndicatorContainer}>
          <LoadingIndicator />
        </div>
      );
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
      <div style={sharedStyles.headerRow}>
        <BackButton to={backPath} accessibilityLabel="Close board edit form" />
      </div>
      {renderContents()}
    </BaseModalScreen>
  );
}
