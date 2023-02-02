import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import NavigationBar from './components/NavigationBar';
import Board from './screens/Board';
import BoardList from './screens/BoardList';

const linking = {
  config: {
    initialRouteName: 'BoardList',
    screens: {
      BoardList: 'boards',
      Board: 'boards/:id',
    },
  },
};

const BoardStack = createNativeStackNavigator();
const Boards = () => (
  <BoardStack.Navigator
    screenOptions={{header: props => <NavigationBar {...props} />}}
  >
    <BoardStack.Screen
      name="BoardList"
      component={BoardList}
      options={{title: 'My Boards'}}
    />
    <BoardStack.Screen name="Board" component={Board} />
  </BoardStack.Navigator>
);

function NavigationContents() {
  // IMPORTANT: NavigationContainer must not rerender too often because
  // it calls the history API, and Safari and Firefox place limits on
  // the frequency of history API calls. (Safari: 100 times in 30
  // seconds).
  return <Boards />;
}

export default function Navigation() {
  // IMPORTANT: NavigationContainer needs to not rerender too often or
  // else Safari and Firefox error on too many history API calls. Put
  // any hooks in NavigationContents so this parent doesn't rerender.
  return (
    <NavigationContainer linking={linking}>
      <NavigationContents />
    </NavigationContainer>
  );
}
