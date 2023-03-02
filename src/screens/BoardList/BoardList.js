import {useLinkTo, useNavigation} from '@react-navigation/native';
import sortBy from 'lodash.sortby';
import {useCallback, useEffect} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Card from '../../components/Card';
import CenterColumn from '../../components/CenterColumn';
import IconButton from '../../components/IconButton';
import LoadingIndicator from '../../components/LoadingIndicator';
import ScreenBackground from '../../components/ScreenBackground';
import Text from '../../components/Text';
import sharedStyles from '../../components/sharedStyles';
import {useBoards, useCreateBoard, useUpdateBoard} from '../../data/boards';
import {useToken} from '../../data/token';
import dateTimeUtils from '../../utils/dateTimeUtils';

export default function BoardList() {
  const {clearToken} = useToken();
  const navigation = useNavigation();
  const linkTo = useLinkTo();

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
    linkTo(`/boards/${board.id}`);
  }

  const {mutate: createBoard, isLoading: isAdding} = useCreateBoard();
  const handleCreateBoard = () =>
    createBoard(null, {
      onSuccess: ({data: board}) => goToBoard(board),
    });

  return (
    <ScreenBackground>
      <CenterColumn>
        <View style={[sharedStyles.fullHeight, sharedStyles.noPadding]}>
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
                  <Card
                    onPress={() => goToBoard(board)}
                    style={sharedStyles.mt}
                  >
                    <View style={styles.boardCard}>
                      <View style={styles.boardTitle}>
                        <Text variant="titleLarge">
                          {board.attributes.name ?? '(unnamed board)'}
                        </Text>
                      </View>
                      <FavoriteButton board={board} />
                    </View>
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
      </CenterColumn>
    </ScreenBackground>
  );
}

function FavoriteButton({board, onToggleFavorite}) {
  const {attributes} = board;
  const isFavorite = Boolean(attributes['favorited-at']);

  const {mutate: updateBoard} = useUpdateBoard(board);
  const handleUpdateBoard = () => {
    const newFavoritedAt = isFavorite
      ? null
      : dateTimeUtils.objectToServerString(new Date());
    updateBoard({...attributes, 'favorited-at': newFavoritedAt});
  };

  return (
    <IconButton
      accessibilityLabel="Favorite"
      icon={isFavorite ? 'star' : 'star-outline'}
      iconColor={isFavorite ? 'orange' : 'gray'}
      style={styles.favoriteStar}
      onPress={handleUpdateBoard}
    />
  );
}

const styles = StyleSheet.create({
  boardCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  boardTitle: {
    flex: 1,
  },
  favoriteStar: {
    margin: 0,
  },
});
