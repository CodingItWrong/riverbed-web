import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import sortBy from 'lodash.sortby';
import {useState} from 'react';
import {FlatList, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Card from '../../components/Card';
import LoadingIndicator from '../../components/LoadingIndicator';
import ScreenBackground from '../../components/ScreenBackground';
import Text from '../../components/Text';
import sharedStyles, {useColumnStyle} from '../../components/sharedStyles';
import {useBoards} from '../../data/boards';
import Board from '../Board';

export default function BoardList() {
  const queryClient = useQueryClient();
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const boardClient = useBoards();

  const {data: boards = [], isLoading} = useQuery(['boards'], () =>
    boardClient.all().then(resp => resp.data),
  );
  const sortedBoards = sortBy(boards, ['attributes.name']);

  const refreshBoards = () => queryClient.invalidateQueries(['boards']);

  const {mutate: addBoard} = useMutation({
    mutationFn: () => boardClient.create({attributes: {}}),
    onSuccess: ({data: column}) => {
      setSelectedBoardId(column.id);
      refreshBoards();
    },
  });

  const columnStyle = useColumnStyle();

  if (selectedBoardId) {
    const board = boards.find(b => b.id === selectedBoardId);

    if (!board) {
      return null; // TODO: maybe handle this better
    }

    return (
      <ScreenBackground>
        <SafeAreaView style={sharedStyles.fullHeight}>
          <Board
            board={board}
            onDelete={() => setSelectedBoardId(null)}
            onGoBack={() => setSelectedBoardId(null)}
          />
        </SafeAreaView>
      </ScreenBackground>
    );
  } else {
    return (
      <ScreenBackground>
        <SafeAreaView style={sharedStyles.fullHeight}>
          <View style={columnStyle}>
            <Text variant="titleLarge">My Boards</Text>
            {isLoading ? (
              <LoadingIndicator />
            ) : (
              <FlatList
                data={sortedBoards}
                keyExtractor={board => board.id}
                renderItem={({item: board}) => (
                  <Card
                    onPress={() => setSelectedBoardId(board.id)}
                    style={sharedStyles.mt}
                  >
                    <Text>{board.attributes.name ?? '(unnamed board)'}</Text>
                  </Card>
                )}
                ListFooterComponent={
                  <Button onPress={addBoard} style={sharedStyles.mt}>
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
}
