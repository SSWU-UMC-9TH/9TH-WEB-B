import './App.css'
import HomePage from './pages/HomePage';
import MoviePage from './pages/MoviePage'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFoundPage from './pages/NotFoundPage';
import MovieDetailPage from './pages/MovieDetailPage';

//BrowserRouter v5
//createBrowerRouter v6

const router = createBrowserRouter([
  {
    path:'/',
    element : <HomePage/>,
    errorElement : <NotFoundPage/>,
    children :[{
      path: 'movies/:category',
      element: <MoviePage/>,
    },
    {
      path: 'movie/:movieId',
      element: <MovieDetailPage/>,
    }
  ]
  }

])
function App() {
  console.log(import.meta.env.VITE_TMOB_KEY);
  return <RouterProvider router={router}/>;
}

export default App
