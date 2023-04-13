import {useNavigation} from '@react-navigation/native';
import {useCallback, useEffect, useState} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Appbar, Provider as PaperProvider} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LoadingIndicator from '../../components/LoadingIndicator';
import ModalScreenWrapper from '../../components/ModalScreenWrapper';
import {useBoard} from '../../data/boards';
import {useColumn} from '../../data/columns';
import {useCurrentBoard} from '../../data/currentBoard';
import useColorSchemeTheme from '../../theme/useColorSchemeTheme';
import EditColumnForm from './EditColumnForm';

// TODO: remove duplication with CardScreen once confirmed this is a good UX
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

  const colorTheme = useColorSchemeTheme(board?.attributes['color-theme']);

  const closeModal = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  function renderContents() {
    if (isFirstLoaded) {
      return <LoadingIndicator />;
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
          {column && (
            <EditColumnForm
              column={column}
              board={board}
              onChange={closeModal}
              onCancel={closeModal}
            />
          )}
        </KeyboardAwareScrollView>
      );
    }
  }

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
            accessibilityLabel="Close column"
          />
        </View>
        {renderContents()}
      </ModalScreenWrapper>
    </PaperProvider>
  );
}

const EXPERIMENTAL_EXTRA_HEIGHT = 150;

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
  },
  container: {
    padding: 16,
  },
});
