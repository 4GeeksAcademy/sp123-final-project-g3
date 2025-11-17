import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Forgot } from "./pages/Forgot";
import { Reset } from "./pages/Reset"; 
import { MapView } from "./pages/MapView";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import User from "./pages/User";
import { Profile } from "./pages/Profile";
const BASE_NAME = import.meta.env.VITE_BASENAME || "/";

export const router = createBrowserRouter(

createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<About />} />   
      <Route path="/single/:theId" element={<Single />} />
      <Route path="/demo" element={<Demo />} />
      <Route index element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot" element={<Forgot />} />
      <Route path="/reset/:token" element={<Reset />} /> 
      <Route path="/map" element={<MapView />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Login />} />
      <Route path="/user" element={<User />} />
    </Route>
  ),
    {
        basename: BASE_NAME
    }
);

  



