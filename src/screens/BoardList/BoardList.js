import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useState} from 'react';
import {FlatList, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Button from '../../components/Button';
import ScreenBackground from '../../components/ScreenBackground';
import Text from '../../components/Text';
import sharedStyles from '../../components/sharedStyles';
import {useBoards} from '../../data/boards';
import Board from '../Board';

export default function BoardList() {
  const queryClient = useQueryClient();
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const boardClient = useBoards();

  const {data: boards = []} = useQuery(['boards'], () =>
    boardClient.all().then(resp => resp.data),
  );

  const refreshBoards = () => queryClient.invalidateQueries(['boards']);

  const {mutate: addBoard} = useMutation({
    mutationFn: () => boardClient.create({attributes: {}}),
    onSuccess: ({data: column}) => {
      setSelectedBoardId(column.id);
      refreshBoards();
    },
  });

  if (selectedBoardId) {
    const board = boards.find(b => b.id === selectedBoardId);

    if (!board) {
      return null; // TODO: maybe handle this better
    }

    return (
      <ScreenBackground>
        <SafeAreaView style={sharedStyles.fullHeight}>
          <Button onPress={() => setSelectedBoardId(null)}>
            Back to Board List
          </Button>
          <Board board={board} onDelete={() => setSelectedBoardId(null)} />
        </SafeAreaView>
      </ScreenBackground>
    );
  } else {
    return (
      <ScreenBackground>
        <SafeAreaView style={sharedStyles.fullHeight}>
          <Text>My Boards</Text>
          <Button onPress={addBoard}>Add Board</Button>
          <FlatList
            data={boards}
            keyExtractor={board => board.id}
            renderItem={({item: board}) => (
              <Button onPress={() => setSelectedBoardId(board.id)}>
                {board.attributes.name}
              </Button>
            )}
          />
        </SafeAreaView>
      </ScreenBackground>
    );
  }
}
