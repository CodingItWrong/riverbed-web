import {useNavigation} from '@react-navigation/native';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import sortBy from 'lodash.sortby';
import {useCallback, useEffect} from 'react';
import {FlatList, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Card from '../../components/Card';
import DropdownMenu from '../../components/DropdownMenu';
import IconButton from '../../components/IconButton';
import LoadingIndicator from '../../components/LoadingIndicator';
import ScreenBackground from '../../components/ScreenBackground';
import Text from '../../components/Text';
import sharedStyles, {useColumnStyle} from '../../components/sharedStyles';
import {useBoards} from '../../data/boards';
import {useToken} from '../../data/token';

export default function BoardList() {
  const {clearToken} = useToken();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const boardClient = useBoards();

  useEffect(() => {
    navigation.setOptions({
      headerRight: renderMenu,
    });
  }, [navigation, renderMenu]);

  const renderMenu = useCallback(
    () => (
      <DropdownMenu
        menuItems={[{title: 'Sign Out', onPress: clearToken}]}
        menuButton={props => (
          <IconButton
            icon="dots-vertical"
            accessibilityLabel="Board Menu"
            {...props}
          />
        )}
      />
    ),
    [],
  );

  const {data: boards = [], isLoading} = useQuery(['boards'], () =>
    boardClient.all().then(resp => resp.data),
  );
  const sortedBoards = sortBy(boards, ['attributes.name']);

  const refreshBoards = () => queryClient.invalidateQueries(['boards']);

  function goToBoard(board) {
    navigation.navigate('Board', {id: board.id});
  }

  const {mutate: addBoard, isLoading: isAdding} = useMutation({
    mutationFn: () => boardClient.create({attributes: {}}),
    onSuccess: ({data: board}) => {
      goToBoard(board);
      refreshBoards();
    },
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
              <Button onPress={addBoard} disabled={isAdding}>
                Add Board
              </Button>
            </View>
          </SafeAreaView>
        )}
      </View>
    </ScreenBackground>
  );
}
