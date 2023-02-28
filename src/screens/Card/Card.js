import ScreenBackground from '../../components/ScreenBackground';
import Text from '../../components/Text';

export default function Card({route}) {
  const {boardId, cardId} = route.params;

  return (
    <ScreenBackground>
      <Text>
        CARD SCREEN {boardId}, {cardId}
      </Text>
    </ScreenBackground>
  );
}
