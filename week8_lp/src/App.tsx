import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom'
import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import HomeLayout from './layouts/HomeLayout'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import SignupPage2 from './pages/SignupPage2'
import SignupPage3 from './pages/SignupPage3'
import MyPage from './pages/MyPage'
import LpCreatePage from './pages/LpCreatePage'
import LpDetailPage from './pages/LpDetailPage'
import { AuthProvider } from './context/AuthContext'
import ProtectedLayout from './layouts/ProtectedLayout'
import GoogleLoginRedirectPage from './pages/GoogleLoginRedirectPage'

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
            {path: 'v1/auth/google/callback', element: <GoogleLoginRedirectPage />},
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
            {
                path: `lps/:lpId`, 
                element: <LpDetailPage />
            },
            {
                path: `lps/create`, 
                element: <LpCreatePage />
            },
        ]
    }
]

const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 3,
        }
    }
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
            {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
    )
}

export default App
