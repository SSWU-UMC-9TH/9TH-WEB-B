import './App.css';
import HomePage from './pages/HomePage';
import MoviePage from "./pages/MoviePage";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFoundPage from './pages/NotFoundPage';
import MovieDetailPage from './pages/MovieDetailPage';
import ToggleExample from './pages/ToggleExample';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: 'movies/:category',
        element: <MoviePage />,
      },
      {
        path: 'movie/:movieId',
        element: <MovieDetailPage />,
      },
      {
        path: 'ex',
        element: <ToggleExample />,
      },
    ]
  },
])

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
