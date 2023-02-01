import {useNavigation} from '@react-navigation/native';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import sortBy from 'lodash.sortby';
import {FlatList, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Card from '../../components/Card';
import LoadingIndicator from '../../components/LoadingIndicator';
import ScreenBackground from '../../components/ScreenBackground';
import Text from '../../components/Text';
import sharedStyles, {useColumnStyle} from '../../components/sharedStyles';
import {useBoards} from '../../data/boards';

export default function BoardList() {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const boardClient = useBoards();

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
      <SafeAreaView style={sharedStyles.fullHeight}>
        <View style={[columnStyle, sharedStyles.fullHeight]}>
          <Text variant="titleLarge">My Boards</Text>
          {isLoading ? (
            <LoadingIndicator />
          ) : (
            <FlatList
              data={sortedBoards}
              keyExtractor={board => board.id}
              renderItem={({item: board}) => (
                <Card onPress={() => goToBoard(board)} style={sharedStyles.mt}>
                  <Text>{board.attributes.name ?? '(unnamed board)'}</Text>
                </Card>
              )}
              ListFooterComponent={
                <Button
                  onPress={addBoard}
                  disabled={isAdding}
                  style={sharedStyles.mt}
                >
                  Add Board
                </Button>
              }
            />
          )}
        </View>
      </SafeAreaView>
    </ScreenBackground>
  );
}
