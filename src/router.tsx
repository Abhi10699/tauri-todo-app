import { createBrowserRouter } from 'react-router-dom';
import { Home } from './pages/Home';
import { TodoGroup } from './pages/TodoGroup';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  // {
  //   path: "/:groupId",
  //   element: <TodoGroup />
  // }
])