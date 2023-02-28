import {useNavigation} from '@react-navigation/native';
import {Platform, StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Appbar} from 'react-native-paper';
import Card from '../../components/Card';
import CenterColumn from '../../components/CenterColumn';
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

  function closeModal() {
    navigation.goBack();
  }

  return (
    <ScreenBackground>
      <CenterColumn>
        <CardWrapper>
          {Platform.OS === 'ios' && (
            <Appbar.BackAction
              onPress={closeModal}
              accessibilityLabel="Go back"
            />
          )}
          {isLoading ? (
            <LoadingIndicator />
          ) : (
            <KeyboardAwareScrollView contentContainerStyle={styles.container}>
              <EditCardForm
                card={card}
                board={board}
                onChange={closeModal}
                onCancel={closeModal}
              />
            </KeyboardAwareScrollView>
          )}
        </CardWrapper>
      </CenterColumn>
    </ScreenBackground>
  );
}

function CardWrapper({children}) {
  return Platform.select({
    web: <Card style={styles.wrapperCard}>{children}</Card>,
    default: <View>{children}</View>,
  });
}

const styles = StyleSheet.create({
  wrapperCard: {
    marginTop: 8,
  },
  container: {
    padding: 16,
  },
});
