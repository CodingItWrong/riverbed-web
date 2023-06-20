import {RouterProvider, createBrowserRouter} from 'react-router-dom';
import Board from './screens/Board';
import BoardEdit from './screens/BoardEdit';
import BoardList from './screens/BoardList';
import Card from './screens/Card';
import Column from './screens/Column';
import Element from './screens/Element';
import SignIn from './screens/SignIn';
import UserSettings from './screens/UserSettings';

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
