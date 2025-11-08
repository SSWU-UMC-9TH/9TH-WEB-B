import { createBrowserRouter, RouterProvider, RouteObject } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import HomeLayout from './layouts/HomeLayout'
import Signup01 from './pages/SignupPage01'
import Signup02 from './pages/SignupPage02'
import Signup03 from './pages/SignupPage03'
import { AuthProvider } from './contexts/AuthContext'
import NotFoundPage from './pages/NotFoundPage'
import MyPage from './pages/MyPage'
import { ProtectedLayout } from './layouts/ProtectedLayout'
import { GoogleLoginRedirectPage } from './pages/GoogleLoginRedirectPage'
import { LpDetail } from './pages/LpDetail'

const publicRouter: RouteObject[] = [
  {
    path: "/v1/auth/google/callback",
    element: <GoogleLoginRedirectPage />,
  },
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <Signup01 /> },
      { path: "signup/password", element: <Signup02 /> },
      { path: "signup/nickname", element: <Signup03 /> },
    ]
  }
];

// 인증 필요한 페이지 protectedRoutes
const protectedRoutes: RouteObject[] = [
  {
    path: "/",
    element: <ProtectedLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "mypage",
        element: <MyPage />
      },
      {
        path: 'lp/:lpid',
        element: <LpDetail />
      }
    ]
  }
]

const router = createBrowserRouter([...publicRouter, ...protectedRoutes]);

export const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default App