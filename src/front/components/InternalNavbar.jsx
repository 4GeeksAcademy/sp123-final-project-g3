import React from "react";
import { Link } from "react-router-dom";
import "./InternalNavbar.css";

export const InternalNavbar = () => {
  return (
    <nav className="navbar navbar-expand-lg custom-navbar shadow-sm">
      <div className="container d-flex align-items-center">

        <div className="d-flex align-items-center gap-2">
          <Link to="/home" className="internalnavbar-brand fw-bold fs-4 meetfit-text">
            MeetFit
          </Link>

          <Link to="/about" className="btn custom2-btn about-btn">
            PROFILE
          </Link>

          <Link to="/register" className="btn custom-btn">
            EVENTOS
          </Link>

          <Link to="/login" className="btn custom-btn">
            FAVORITOS
          </Link>
        </div>

        {/* SEARCH BAR */}
        <div className="flex-grow-1 d-flex justify-content-center">
          <input
            type="text"
            placeholder="Search..."
            className="form-control"
            style={{ maxWidth: "250px" }}
          />
        </div>

      
        <div className="d-flex align-items-center gap-2">
          <Link to="/login" className="btn custom-btn">
            HOME
          </Link>
          <Link to="/login" className="btn custom-btn">
            ABOUT
          </Link>
          <Link to="/login" className="btn custom2-btn">
            LOG OUT
          </Link>
        </div>

      </div>
    </nav>
  );
};
