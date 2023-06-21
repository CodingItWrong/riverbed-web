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
    children: [
      {
        path: 'settings',
        element: <UserSettings />,
      },
    ],
  },
  {
    path: 'boards/:boardId',
    element: <Board />,
    children: [
      {
        path: 'cards/:cardId',
        element: <Card />,
        children: [
          {
            path: 'elements/:elementId',
            element: <Element />,
          },
        ],
      },
      {
        path: 'columns/:columnId',
        element: <Column />,
      },
      {
        path: 'edit',
        element: <BoardEdit />,
      },
    ],
  },
]);

export default function Navigation() {
  return <RouterProvider router={router} />;
}
