import {useNavigation} from '@react-navigation/native';
import {StyleSheet} from 'react-native';
import LoadingIndicator from '../../components/LoadingIndicator';
import ScreenBackground from '../../components/ScreenBackground';
import {useBoard} from '../../data/boards';
import {useCard} from '../../data/cards';
import EditCardForm from '../Board/Card/EditCardForm';

export default function CardScreen({route}) {
  const {boardId, cardId} = route.params;
  const navigation = useNavigation();

  const {data: board, isLoading: isLoadingBoard} = useBoard(boardId);
  const {data: card, isLoading: isLoadingCard} = useCard({boardId, cardId});
  const isLoading = isLoadingBoard || isLoadingCard;

  function handleChange() {
    // TODO: actually save
    navigation.goBack();
  }
  function handleCancel() {
    navigation.goBack();
  }

  return (
    <ScreenBackground style={styles.container}>
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <EditCardForm
          card={card}
          board={board}
          onChange={handleChange}
          onCancel={handleCancel}
        />
      )}
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
