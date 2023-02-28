import {useNavigation} from '@react-navigation/native';
import {useCallback, useEffect, useState} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Appbar} from 'react-native-paper';
import Card from '../../components/Card';
import CenterModal from '../../components/CenterModal';
import LoadingIndicator from '../../components/LoadingIndicator';
import ScreenBackground from '../../components/ScreenBackground';
import {useBoard} from '../../data/boards';
import {useCard} from '../../data/cards';
import {useCurrentBoard} from '../../data/currentBoard';
import EditCardForm from '../Board/Card/EditCardForm';
import ElementList from '../Board/Element/ElementList';

export default function CardScreen({route}) {
  const {boardId} = useCurrentBoard();
  const {cardId} = route.params;
  const navigation = useNavigation();
  const [isEditingElements, setIsEditingElements] = useState(false);

  const {data: board, isLoading: isLoadingBoard} = useBoard(boardId);
  const {data: card, isLoading: isLoadingCard} = useCard({boardId, cardId});
  const isLoading = isLoadingBoard || isLoadingCard;

  function closeModal() {
    navigation.goBack();
  }

  function renderContents() {
    if (isLoading) {
      return <LoadingIndicator />;
    } else if (isEditingElements) {
      return <ElementList board={board} />;
    } else {
      return (
        <KeyboardAwareScrollView>
          {card && (
            <EditCardForm
              card={card}
              board={board}
              onChange={closeModal}
              onCancel={closeModal}
            />
          )}
        </KeyboardAwareScrollView>
      );
    }
  }

  const renderEditElementsButton = useCallback(
    () => (
      <Appbar.Action
        accessibilityLabel="Edit Elements"
        icon="wrench"
        onPress={() => setIsEditingElements(on => !on)}
      />
    ),
    [],
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => renderEditElementsButton(),
    });
  }, [navigation, renderEditElementsButton]);

  return (
    <CardWrapper closeModal={closeModal}>
      {Platform.OS !== 'android' && (
        <View style={styles.headerRow}>
          <Appbar.BackAction
            onPress={closeModal}
            accessibilityLabel="Go back"
          />
          {renderEditElementsButton()}
        </View>
      )}
      {renderContents()}
    </CardWrapper>
  );
}

function CardWrapper({children, closeModal}) {
  return Platform.select({
    web: (
      <CenterModal onDismiss={closeModal}>
        <Card style={styles.wrapperCard}>{children}</Card>
      </CenterModal>
    ),
    default: (
      <ScreenBackground style={styles.container}>{children}</ScreenBackground>
    ),
  });
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  wrapperCard: {
    marginTop: 8,
  },
  container: {
    padding: 16,
  },
});
