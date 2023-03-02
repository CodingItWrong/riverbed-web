import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useEffect} from 'react';
import {Platform} from 'react-native';
import NavigationBar from './components/NavigationBar';
import {useCurrentBoard} from './data/currentBoard';
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
      BoardStack: {
        path: 'boards/:boardId',
        initialRouteName: 'Board',
        screens: {
          Board: '/',
          Card: 'cards/:cardId',
        },
      },
      SignIn: '/',
    },
  },
};

const modalOptions = Platform.select({
  android: {
    presentation: 'modal',
    title: 'Card',
  },
  ios: {
    headerShown: false,
    presentation: 'formSheet',
  },
  web: {
    headerShown: false,
    presentation: 'transparentModal',
  },
});
const BoardStack = createNativeStackNavigator();
const Boards = ({route}) => {
  const {boardId} = route.params;
  const {setBoardId} = useCurrentBoard();

  useEffect(() => {
    setBoardId(boardId);
  }, [setBoardId, boardId]);

  return (
    <BoardStack.Navigator
      screenOptions={{
        header: props => <NavigationBar {...props} />,
      }}
    >
      <BoardStack.Screen name="Board" component={Board} />
      <AppStack.Screen name="Card" component={Card} options={modalOptions} />
    </BoardStack.Navigator>
  );
};

const AppStack = createNativeStackNavigator();
const AppNav = () => {
  const {isLoggedIn} = useToken();
  return (
    <AppStack.Navigator
      screenOptions={{header: props => <NavigationBar {...props} />}}
    >
      {!isLoggedIn && (
        <AppStack.Screen
          name="SignIn"
          component={SignIn}
          options={{title: 'ListApp'}}
        />
      )}
      {isLoggedIn && (
        <>
          <AppStack.Screen
            name="BoardList"
            component={BoardList}
            options={{title: 'My Boards 3/2 D'}}
          />
          <AppStack.Screen
            name="BoardStack"
            component={Boards}
            options={{headerShown: false}}
          />
        </>
      )}
    </AppStack.Navigator>
  );
};

function NavigationContents() {
  // IMPORTANT: NavigationContainer must not rerender too often because
  // it calls the history API, and Safari and Firefox place limits on
  // the frequency of history API calls. (Safari: 100 times in 30
  // seconds).
  return <AppNav />;
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
