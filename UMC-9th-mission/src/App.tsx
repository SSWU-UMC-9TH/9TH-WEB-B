import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom'
import './App.css'
import HomeLayout from './layouts/HomeLayout'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import SignupPage2 from './pages/SignupPage2'
import SignupPage3 from './pages/SignupPage3'
import MyPage from './pages/MyPage'
import { AuthProvider } from './context/AuthContext'
import ProtectedLayout from './layouts/ProtectedLayout'

// publicRoutes: 인증 없이 접근 가능한 라우트
const publicRoutes: RouteObject[] = [
    {
        path: '/',
        element: <HomeLayout />,
        errorElement: <NotFoundPage />,
        children: [
            {index: true, element: <HomePage />},
            {path: 'login', element: <LoginPage />},
            {path: 'signup', element: <SignupPage />},
            {path: 'signup2', element: <SignupPage2 />},
            {path: 'signup3', element: <SignupPage3 />},
        ]
    }
];


// protectedRoutes: 인증이 필요한 라우트
const protectedRoutes: RouteObject[] = [
{
        path: '/',
        element: <ProtectedLayout />,
        children: [
            {
                path: 'my', 
                element: <MyPage />
            },
        ]
    }
]

const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);

function App() {
    return (
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    )
}

export default App
