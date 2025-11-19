import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";


export const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg custom-navbar shadow-sm">
      <div className="container">
        
        <Link to="/home" className="navbar-brand fw-bold fs-4 meetfit-text">
          MeetFit
        </Link>

        <div className="d-flex align-items-center ms-auto gap-2">
          <Link to="/about" className="btn custom2-btn about-btn">
            SOBRE
          </Link>
          <br></br><br></br>
          <Link to="/register" className="btn custom-btn">
            ÚNETE
          </Link>
          <Link to="/login" className="btn custom-btn">
            LOGEATE
          </Link>
        </div>
      </div>
    </nav>
  );
};
