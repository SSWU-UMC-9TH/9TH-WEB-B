import HomeLayout from "./layouts/HomeLayout.tsx"
import HomePage from "./pages/HomePage.tsx"
import NotFoundPage from "./pages/NotFoundPage.tsx"
import LoginPage from "./pages/LoginPage.tsx"
import SignupPage from "./pages/SignupPage.tsx"

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
{
  path: "/",
  element: <HomeLayout />,
  errorElement: <NotFoundPage />,
  children: [
    {index: true, element: <HomePage />},
    {path: "login", element: <LoginPage />},
    {path: "signup", element: <SignupPage />},
  ],

},
]);

function App() {
  return <RouterProvider router = {router}/>;
}

export default App;