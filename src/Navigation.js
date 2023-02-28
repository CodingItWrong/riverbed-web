import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {TransitionPresets, createStackNavigator} from '@react-navigation/stack';
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
  // TODO: android
  ios: {
    ...TransitionPresets.ModalPresentationIOS,
  },
  web: {
    presentation: 'transparentModal',
    cardOverlayEnabled: true,
  },
});
const BoardStack = createStackNavigator();
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
      <AppStack.Screen
        name="Card"
        component={Card}
        options={{
          headerShown: false,
          ...modalOptions,
        }}
      />
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
            options={{title: 'My Boards 2/28'}}
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
