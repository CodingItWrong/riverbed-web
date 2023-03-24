import {useLinkTo, useNavigation} from '@react-navigation/native';
import sortBy from 'lodash.sortby';
import {useCallback, useEffect} from 'react';
import {SectionList, StyleSheet, View} from 'react-native';
import {Card} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Button from '../../components/Button';
import CenterColumn from '../../components/CenterColumn';
import {Icon} from '../../components/Icon';
import IconButton from '../../components/IconButton';
import LoadingIndicator from '../../components/LoadingIndicator';
import ScreenBackground from '../../components/ScreenBackground';
import SectionHeader from '../../components/SectionHeader';
import Text from '../../components/Text';
import sharedStyles from '../../components/sharedStyles';
import {useBoards, useCreateBoard, useUpdateBoard} from '../../data/boards';
import {useToken} from '../../data/token';
import {colorThemes} from '../../theme/colorThemes';
import useDebouncedColorScheme from '../../theme/useDebouncedColorScheme';
import dateTimeUtils from '../../utils/dateTimeUtils';

export default function BoardList() {
  const {clearToken} = useToken();
  const navigation = useNavigation();
  const linkTo = useLinkTo();
  const colorScheme = useDebouncedColorScheme();

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

  function goToBoard(board) {
    linkTo(`/boards/${board.id}`);
  }

  const {mutate: createBoard, isLoading: isAdding} = useCreateBoard();
  const handleCreateBoard = () =>
    createBoard(null, {
      onSuccess: ({data: board}) => goToBoard(board),
    });

  const boardGroups = groupBoards(boards);

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
              <SectionList
                sections={boardGroups}
                keyExtractor={board => board.id}
                contentContainerStyle={sharedStyles.columnPadding}
                stickySectionHeadersEnabled={false}
                renderSectionHeader={({section: group}) => {
                  if (!group.title) {
                    return;
                  }

                  return (
                    <SectionHeader testID="group-heading">
                      {group.title}
                    </SectionHeader>
                  );
                }}
                renderItem={({item: board}) => {
                  let backgroundColor = null;
                  let foregroundColor = null;
                  if (board.attributes['color-theme']) {
                    const {colors} =
                      colorThemes[board.attributes['color-theme']][colorScheme];
                    backgroundColor = colors.secondaryContainer;
                    foregroundColor = colors.onSecondaryContainer;
                  }

                  return (
                    <Card
                      onPress={() => goToBoard(board)}
                      style={[
                        sharedStyles.mt,
                        backgroundColor && {backgroundColor},
                      ]}
                    >
                      <View style={styles.boardCard}>
                        <Icon
                          name={board.attributes.icon ?? 'view-column'}
                          style={sharedStyles.mr}
                          color={foregroundColor}
                        />
                        <View style={sharedStyles.fill}>
                          <Text
                            variant="titleMedium"
                            style={foregroundColor && {color: foregroundColor}}
                          >
                            {board.attributes.name ?? '(unnamed board)'}
                          </Text>
                        </View>
                        <FavoriteButton board={board} />
                      </View>
                    </Card>
                  );
                }}
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

function groupBoards(boards) {
  const favorites = boards.filter(board => board.attributes['favorited-at']);
  const unfavorites = boards.filter(board => !board.attributes['favorited-at']);

  const groups = [];

  if (favorites.length > 0) {
    groups.push({
      title: 'Favorites',
      data: sortBy(favorites, ['attributes.favorited-at']),
    });
  }

  if (unfavorites.length > 0) {
    const title = favorites.length > 0 ? 'Other Boards' : null;
    groups.push({title, data: sortBy(unfavorites, ['attributes.name'])});
  }
  return groups;
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
      accessibilityLabel={
        isFavorite
          ? `${attributes.name} is a favorite board`
          : `${attributes.name} is not a favorite board`
      }
      icon={isFavorite ? 'star' : 'star-outline'}
      iconColor={isFavorite ? 'orange' : 'gray'}
      style={styles.favoriteStar}
      onPress={handleUpdateBoard}
    />
  );
}

const styles = StyleSheet.create({
  boardCard: {
    paddingLeft: 16,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteStar: {
    margin: 5,
  },
});
