import { RouteObject } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import AuthLayout from "@/components/layout/AuthLayout";
import AuthGuard from "@/hocs/AuthGuard";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import VerifyOTP from "@/pages/VerifyOTP";
import ForgotPassword from "@/pages/ForgotPassword";
import Profile from "@/pages/Profile";
import ProductDetail from "@/pages/ProductDetail";
import SearchPage from "@/pages/SearchPage";

export const getRoutes = (): RouteObject[] => {
  const role = "ADMIN";

  const publicRoutes: RouteObject[] = [
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "search",
          element: <SearchPage />,
        },
        {
          path: "product/:slug",
          element: <ProductDetail />,
        },
        {
          path: "profile",
          element: (
            <AuthGuard>
              <Profile />
            </AuthGuard>
          ),
        },
      ],
    },
    {
      path: "auth",
      element: <AuthLayout />,
      children: [
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "verify-otp",
          element: <VerifyOTP />,
        },
        {
          path: "forgot-password",
          element: <ForgotPassword />,
        },
      ],
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ];

  const adminRoutes: RouteObject[] = [];

  switch (role) {
    case "ADMIN":
      return [...publicRoutes, ...adminRoutes];
    default:
      return publicRoutes;
  }
};
