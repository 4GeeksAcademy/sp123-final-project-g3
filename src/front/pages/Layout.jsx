import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { Navbar } from "../components/Navbar";
import { InternalNavbar } from "../components/InternalNavbar";

import ScrollToTop from "../components/ScrollToTop";
import { Footer } from "../components/Footer";


export const Layout = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Comprobamos si el usuario está autenticado leyendo el token
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); 
  }, []);

  // Ruta del Splash: siempre muestra el Navbar público
  const isSplash = location.pathname === "/splash";

  return (
    <>
      <ScrollToTop />

      {/* 
        LÓGICA DE NAVBARS
        - Si estamos en "/splash" → Navbar público
        - Si NO estamos en splash:
              → Si está logeado → InternalNavbar
              → Si NO está logeado → Navbar público
      */}
      {isSplash ? (
        <Navbar />
      ) : isLoggedIn ? (
        <InternalNavbar setIsLoggedIn={setIsLoggedIn} />
      ) : (
        <Navbar />
      )}

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
};
