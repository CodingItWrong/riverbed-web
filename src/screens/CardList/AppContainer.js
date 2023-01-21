import {useState} from 'react';
import {StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Button from '../../components/Button';
import ScreenBackground from '../../components/ScreenBackground';
import CardList from './CardList';
import ElementList from './ElementList';

export default function AppContainer() {
  const [editingElements, setEditingElements] = useState(false);

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.fullHeight}>
        {editingElements ? (
          <Button onPress={() => setEditingElements(false)}>
            Done Editing Elements
          </Button>
        ) : (
          <Button onPress={() => setEditingElements(true)}>
            Edit Elements
          </Button>
        )}
        {editingElements ? <ElementList /> : <CardList />}
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  fullHeight: {
    flex: 1,
  },
});
