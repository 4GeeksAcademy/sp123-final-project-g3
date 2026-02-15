import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import Home from "./pages/Home.jsx";
import { Single } from "./pages/Single";
import Login from "./pages/Login";
import Register from "./pages/Register.jsx";
import Search from "./pages/Search.jsx";
import Statistics from "./pages/Statistics.jsx";
import Profile from "./pages/Profile.jsx";
import RecoverPassword from "./pages/RecoverPassword.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { PublicRoute } from "./components/PublicRoute.jsx";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
      <Route path="/" element={<Navigate to="/search" replace />} />
      <Route path="/search" element={<Search />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/recover-password"
        element={
          <PublicRoute>
            <RecoverPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/board"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/single/:theId"
        element={
          <ProtectedRoute>
            <Single />
          </ProtectedRoute>
        }
      />
      <Route
        path="/statistics"
        element={
          <ProtectedRoute>
            <Statistics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Route>
  )
);
