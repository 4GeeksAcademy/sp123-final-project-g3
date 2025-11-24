import React from "react";
import { Outlet, useLocation } from "react-router-dom";

import { Navbar } from "../components/Navbar";
import { InternalNavbar } from "../components/InternalNavbar";
import ScrollToTop from "../components/ScrollToTop";
import { Footer } from "../components/Footer";

export const Layout = () => {
  const location = useLocation();

  // Si tenéis una página tipo splash
  const isSplashPage = location.pathname === "/splash";

  // Se recalcula en cada render
 const isLoggedIn = !!localStorage.getItem("JWT-STORAGE-KEY");

  const renderNavbar = () => {
    if (isSplashPage) return <Navbar />;
    return isLoggedIn ? <InternalNavbar /> : <Navbar />;
  };

  return (
    <>
      <ScrollToTop />
      {renderNavbar()}
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};