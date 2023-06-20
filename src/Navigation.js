import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useEffect} from 'react';
import {RouterProvider, createBrowserRouter} from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import {useCurrentBoard} from './data/currentBoard';
import {useToken} from './data/token';
import Board from './screens/Board';
import BoardEdit from './screens/BoardEdit';
import BoardList from './screens/BoardList';
import Card from './screens/Card';
import Column from './screens/Column';
import Element from './screens/Element';
import SignIn from './screens/SignIn';
import UserSettings from './screens/UserSettings';

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
          BoardEdit: '/edit',
          Column: 'columns/:columnId',
          Card: 'cards/:cardId',
          Element: 'elements/:elementId',
        },
      },
      UserSettings: '/user-settings',
      SignIn: '/',
    },
  },
};

const modalOptions = {
  headerShown: false,
  presentation: 'transparentModal',
};
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
      <BoardStack.Screen
        name="Board"
        component={Board}
        options={{headerShown: false}}
      />
      <BoardStack.Screen
        name="BoardEdit"
        component={BoardEdit}
        options={{...modalOptions, title: 'Edit Board'}}
      />
      <AppStack.Screen
        name="Column"
        component={Column}
        options={modalOptions}
      />
      <AppStack.Screen name="Card" component={Card} options={modalOptions} />
      <AppStack.Screen
        name="Element"
        component={Element}
        options={modalOptions}
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
          options={{title: 'Riverbed'}}
        />
      )}
      {isLoggedIn && (
        <>
          <AppStack.Screen
            name="BoardList"
            component={BoardList}
            options={{title: 'My Boards'}}
          />
          <AppStack.Screen
            name="BoardStack"
            component={Boards}
            options={{headerShown: false}}
          />
          <AppStack.Screen
            name="UserSettings"
            component={UserSettings}
            options={modalOptions}
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

function ReactNavigation() {
  // IMPORTANT: NavigationContainer needs to not rerender too often or
  // else Safari and Firefox error on too many history API calls. Put
  // any hooks in NavigationContents so this parent doesn't rerender.
  return (
    <NavigationContainer linking={linking}>
      <NavigationContents />
    </NavigationContainer>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <SignIn />,
  },
  {
    path: 'boards',
    element: <BoardList />,
  },
  {
    path: 'boards/:boardId',
    element: <Board />,
  },
  {
    path: 'boards/:boardId/cards/:cardId',
    element: <Card />,
  },
  {
    path: 'boards/:boardId/cards/:cardId/elements/:elementId',
    element: <Element />,
  },
  {
    path: 'boards/:boardId/columns/:columnId',
    element: <Column />,
  },
  {
    path: 'boards/:boardId/edit',
    element: <BoardEdit />,
  },
  {
    path: 'settings',
    element: <UserSettings />,
  },
]);

export default function Navigation() {
  return <RouterProvider router={router} />;
}
