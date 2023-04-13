import {useNavigation} from '@react-navigation/native';
import {useCallback, useEffect, useState} from 'react';
import {Platform, ScrollView, StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Appbar, Provider as PaperProvider} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Card from '../../components/Card';
import CenterModal from '../../components/CenterModal';
import ErrorSnackbar from '../../components/ErrorSnackbar';
import LoadingIndicator from '../../components/LoadingIndicator';
import ModalScreenWrapper from '../../components/ModalScreenWrapper';
import ScreenBackground from '../../components/ScreenBackground';
import sharedStyles from '../../components/sharedStyles';
import {useBoard} from '../../data/boards';
import {useCard, useDeleteCard} from '../../data/cards';
import {useCurrentBoard} from '../../data/currentBoard';
import useColorSchemeTheme from '../../theme/useColorSchemeTheme';
import EditCardForm from './EditCardForm';
import ElementList from './Element/ElementList';

export default function CardScreen({route}) {
  const insets = useSafeAreaInsets();
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
        <Appbar.Action
          accessibilityLabel="Done Editing Elements"
          icon="check-bold"
          onPress={() => setIsEditingElements(on => !on)}
        />
      );
    } else {
      return (
        <>
          <Appbar.Action
            accessibilityLabel="Edit Elements"
            icon="wrench"
            onPress={() => setIsEditingElements(on => !on)}
          />
          <Appbar.Action
            accessibilityLabel="Delete Card"
            icon="delete"
            onPress={handleDeleteCard}
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
    } else {
      return (
        <KeyboardAwareScrollView
          contentContainerStyle={[
            styles.container,
            {paddingBottom: insets.bottom},
          ]}
          scrollIndicatorInsets={{bottom: insets.bottom}}
          extraHeight={EXPERIMENTAL_EXTRA_HEIGHT}
        >
          {card && (
            <EditCardForm card={card} board={board} onClose={closeModal} />
          )}
        </KeyboardAwareScrollView>
      );
    }
  }

  const colorTheme = useColorSchemeTheme(board?.attributes['color-theme']);

  return (
    <PaperProvider theme={colorTheme}>
      <ModalScreenWrapper closeModal={closeModal}>
        <View
          style={[
            styles.headerRow,
            Platform.OS === 'android' && {paddingTop: insets.top},
          ]}
        >
          <Appbar.BackAction
            onPress={closeModal}
            accessibilityLabel="Close card"
          />
          <View style={sharedStyles.spacer} />
          {renderButtonControls()}
        </View>
        {renderContents()}
      </ModalScreenWrapper>
      <ErrorSnackbar error={deleteError}>
        An error occurred deleting the card.
      </ErrorSnackbar>
    </PaperProvider>
  );
}

const EXPERIMENTAL_EXTRA_HEIGHT = 150;

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    padding: 16,
  },
});
