import {useNavigation} from '@react-navigation/native';
import {useCallback, useEffect, useState} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {Appbar} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LoadingIndicator from '../../components/LoadingIndicator';
import {useBoard} from '../../data/boards';
import {useColumn} from '../../data/columns';
import {useCurrentBoard} from '../../data/currentBoard';
import BaseModalScreen from '../BaseModalScreen';
import EditColumnForm from './EditColumnForm';

export default function ColumnScreen({route}) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const {boardId} = useCurrentBoard();
  const {columnId} = route.params;

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
    navigation.goBack();
  }, [navigation]);

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
