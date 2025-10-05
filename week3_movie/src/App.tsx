import './App.css';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import MoviePage from './pages/MoviePage';
import NotFound from './pages/NotFound';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <NotFound />,
    children: [
      { path: 'movies/:category', element: <MoviePage /> },          // 리스트
      { path: 'movies/:category/:id', element: <MovieDetailPage /> },      // 상세
    ],
  },
  { path: '*', element: <NotFound /> },
]);

function App() {
  return <RouterProvider router={router} />;
}
export default App;