import {useNavigation} from '@react-navigation/native';
import sortBy from 'lodash.sortby';
import {useCallback, useEffect} from 'react';
import {FlatList, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Card from '../../components/Card';
import IconButton from '../../components/IconButton';
import LoadingIndicator from '../../components/LoadingIndicator';
import ScreenBackground from '../../components/ScreenBackground';
import Text from '../../components/Text';
import sharedStyles, {useColumnStyle} from '../../components/sharedStyles';
import {useBoards, useCreateBoard} from '../../data/boards';
import {useToken} from '../../data/token';

export default function BoardList() {
  const {clearToken} = useToken();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: renderMenu,
    });
  }, [navigation, renderMenu]);

  const renderMenu = useCallback(
    () => (
      <IconButton
        icon="logout"
        accessibilityLabel="Sign Out"
        onPress={clearToken}
      />
    ),
    [clearToken],
  );

  const {data: boards = [], isLoading} = useBoards();
  const sortedBoards = sortBy(boards, ['attributes.name']);

  function goToBoard(board) {
    navigation.navigate('Board', {id: board.id});
  }

  const {mutate: createBoard, isLoading: isAdding} = useCreateBoard();
  const handleCreateBoard = () =>
    createBoard(null, {
      onSuccess: ({data: board}) => goToBoard(board),
    });

  const columnStyle = useColumnStyle();

  return (
    <ScreenBackground>
      <View
        style={[columnStyle, sharedStyles.fullHeight, sharedStyles.noPadding]}
      >
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <SafeAreaView
            style={sharedStyles.fullHeight}
            edges={['left', 'right', 'bottom']}
          >
            <FlatList
              data={sortedBoards}
              keyExtractor={board => board.id}
              contentContainerStyle={sharedStyles.columnPadding}
              renderItem={({item: board}) => (
                <Card onPress={() => goToBoard(board)} style={sharedStyles.mt}>
                  <Text>{board.attributes.name ?? '(unnamed board)'}</Text>
                </Card>
              )}
            />
            <View style={sharedStyles.columnPadding}>
              <Button
                mode="link"
                icon="plus"
                onPress={handleCreateBoard}
                disabled={isAdding}
              >
                Add Board
              </Button>
            </View>
          </SafeAreaView>
        )}
      </View>
    </ScreenBackground>
  );
}
