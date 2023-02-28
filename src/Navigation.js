import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Platform} from 'react-native';
import NavigationBar from './components/NavigationBar';
import {useToken} from './data/token';
import Board from './screens/Board';
import BoardList from './screens/BoardList';
import Card from './screens/Card';
import SignIn from './screens/SignIn';

const linking = {
  config: {
    initialRouteName: 'BoardList',
    screens: {
      BoardList: 'boards',
      Board: 'boards/:id',
      Card: 'boards/:boardId/cards/:cardId',
      SignIn: '/',
    },
  },
};

const BoardStack = createNativeStackNavigator();
const Boards = () => {
  const {isLoggedIn} = useToken();
  return (
    <BoardStack.Navigator
      screenOptions={{header: props => <NavigationBar {...props} />}}
    >
      {!isLoggedIn && (
        <BoardStack.Screen
          name="SignIn"
          component={SignIn}
          options={{title: 'ListApp'}}
        />
      )}
      {isLoggedIn && (
        <>
          <BoardStack.Screen
            name="BoardList"
            component={BoardList}
            options={{title: 'My Boards 2/28'}}
          />
          <BoardStack.Screen name="Board" component={Board} />
          <BoardStack.Group
            screenOptions={{
              presentation: 'formSheet',
              headerShown: Platform.OS !== 'ios',
            }}
          >
            <BoardStack.Screen
              name="Card"
              component={Card}
              options={{title: 'Card'}}
            />
          </BoardStack.Group>
        </>
      )}
    </BoardStack.Navigator>
  );
};

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
