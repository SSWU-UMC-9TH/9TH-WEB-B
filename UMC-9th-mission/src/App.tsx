import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import HomeLayout from './layouts/HomeLayout'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import SignupPage2 from './pages/SignupPage2'
import SignupPage3 from './pages/SignupPage3'
import MyPage from './pages/MyPage'

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomeLayout />,
        errorElement: <NotFoundPage />,
        children: [
            {index: true, element: <HomePage />},
            {path: 'login', element: <LoginPage />},
            {path: 'signup', element: <SignupPage />},
            {path: 'signup2', element: <SignupPage2 />},
            {path: 'signup3', element: <SignupPage3 />},
            {path: 'my', element: <MyPage />},
        ]
    },
])

function App() {
    return (
        <RouterProvider router={router} />
    )
}

export default App
