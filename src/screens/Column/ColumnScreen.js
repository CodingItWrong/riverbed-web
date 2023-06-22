import {useCallback, useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import BackButton from '../../components/BackButton';
import LoadingIndicator from '../../components/LoadingIndicator';
import sharedStyles from '../../components/sharedStyles';
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
      <div style={sharedStyles.headerRow}>
        <BackButton to={backPath} accessibilityLabel="Close column" />
      </div>
      {renderContents()}
    </BaseModalScreen>
  );
}
