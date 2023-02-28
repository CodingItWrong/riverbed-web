import {useNavigation} from '@react-navigation/native';
import LoadingIndicator from '../../components/LoadingIndicator';
import ScreenBackground from '../../components/ScreenBackground';
import {useBoard} from '../../data/boards';
import {useCard} from '../../data/cards';
import CardDetail from '../Board/Card/CardDetail';

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
    <ScreenBackground>
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <CardDetail
          card={card}
          board={board}
          onChange={handleChange}
          onCancel={handleCancel}
        />
      )}
    </ScreenBackground>
  );
}
