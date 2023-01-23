import {useQuery} from '@tanstack/react-query';
import {useState} from 'react';
import {FlatList, View} from 'react-native';
import Button from '../../components/Button';
import Text from '../../components/Text';
import {useBoards} from '../../data/boards';
import Board from '../Board';

export default function BoardList() {
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const boardClient = useBoards();

  const {data: boards = []} = useQuery(['boards'], () =>
    boardClient.all().then(resp => resp.data),
  );

  if (selectedBoardId) {
    const board = boards.find(b => b.id === selectedBoardId);

    return (
      <View>
        <Button onPress={() => setSelectedBoardId(null)}>
          Back to Board List
        </Button>
        <Board board={board} />
      </View>
    );
  } else {
    return (
      <View>
        <Text>My Boards</Text>
        <FlatList
          data={boards}
          keyExtractor={board => board.id}
          renderItem={({item: board}) => (
            <Button onPress={() => setSelectedBoardId(board.id)}>
              {board.attributes.name}
            </Button>
          )}
        />
      </View>
    );
  }
}
