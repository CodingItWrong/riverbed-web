import {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Button from '../../components/Button';
import ScreenBackground from '../../components/ScreenBackground';
import Text from '../../components/Text';
import sharedStyles from '../../components/sharedStyles';
import ColumnList from './ColumnList';
import ElementList from './ElementList';

export default function Board({board}) {
  const [editingElements, setEditingElements] = useState(false);

  return (
    <ScreenBackground>
      <SafeAreaView style={sharedStyles.fullHeight}>
        <Text>{board.attributes.name}</Text>
        {editingElements ? (
          <Button onPress={() => setEditingElements(false)}>
            Done Editing Elements
          </Button>
        ) : (
          <Button onPress={() => setEditingElements(true)}>
            Edit Elements
          </Button>
        )}
        {editingElements ? (
          <ElementList board={board} />
        ) : (
          <ColumnList board={board} />
        )}
      </SafeAreaView>
    </ScreenBackground>
  );
}
