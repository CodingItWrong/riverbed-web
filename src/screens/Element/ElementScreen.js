import {useNavigation} from '@react-navigation/native';
import {Platform} from 'expo-modules-core';
import {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Appbar} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LoadingIndicator from '../../components/LoadingIndicator';
import {useBoard} from '../../data/boards';
import {useCurrentBoard} from '../../data/currentBoard';
import {useBoardElement} from '../../data/elements';
import BaseModalScreen from '../BaseModalScreen';
import EditElementForm from './EditElementForm';

export default function ElementScreen({route}) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const {boardId} = useCurrentBoard();
  const {elementId} = route.params;

  const {data: board} = useBoard(boardId);
  const {data: element} = useBoardElement({boardId, elementId});
  const [isFirstLoaded, setIsFirstLoaded] = useState(true);
  useEffect(() => {
    if (element) {
      // do not do this in useCard onSuccess because we want it to happen even if the card is cached
      setIsFirstLoaded(false);
    }
  }, [element]);

  const closeModal = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  function renderContents() {
    if (isFirstLoaded) {
      return <LoadingIndicator />;
    } else if (element) {
      return (
        <EditElementForm
          element={element}
          board={board}
          onSave={closeModal}
          onDelete={closeModal}
          onCancel={closeModal}
        />
      );
    } else {
      return null;
    }
  }

  return (
    <BaseModalScreen>
      <View
        style={[
          styles.headerRow,
          Platform.OS === 'android' && {paddingTop: insets.top},
        ]}
      >
        <Appbar.BackAction
          onPress={closeModal}
          accessibilityLabel="Close column"
        />
      </View>
      {renderContents()}
    </BaseModalScreen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
  },
});
