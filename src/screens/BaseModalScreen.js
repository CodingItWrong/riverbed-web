import {useNavigate} from 'react-router-dom';
import Card from '../components/Card';
import CenterModal from '../components/CenterModal';
import sharedStyles from '../components/sharedStyles';

export default function BaseModalScreen({backTo, children}) {
  if (!backTo) {
    throw new Error('BaseModalScreen: backTo prop is required');
  }

  const navigate = useNavigate();

  return (
    <ModalScreenWrapper closeModal={() => navigate(backTo)}>
      {children}
    </ModalScreenWrapper>
  );
}

/**
 * Wrapper around a modal screen.
 * Provides extra styling for web as we don't get it by default.
 */
function ModalScreenWrapper({children, closeModal}) {
  return (
    <CenterModal onDismiss={closeModal}>
      <Card
        style={styles.wrapperCard}
        contentStyle={{...sharedStyles.fill, ...styles.modalCard}}
      >
        {children}
      </Card>
    </CenterModal>
  );
}

const styles = {
  wrapperCard: {
    marginTop: 8,
    maxHeight: '90%',
    overflowY: 'auto',
  },
  container: {
    padding: 16,
  },
  modalCard: {
    padding: '16px',
  },
};
