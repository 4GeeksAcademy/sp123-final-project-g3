import { Link, useNavigate } from "react-router-dom";
import "./InternalNavbar.css";

export const InternalNavbar = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem("JWT-STORAGE-KEY"); 
    localStorage.removeItem("USER")             
    navigate("/home");                  
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar shadow-sm">
      <div className="container d-flex align-items-center">
        <div className="d-flex align-items-center gap-2">
          <Link to="/home" className="internalnavbar-brand fw-bold fs-4 meetfit-text">
            MeetFit
          </Link>
        </div>

        <div className="d-flex align-items-center gap-2 ms-2 left-menu">
          <Link to="/profile" className="btn custom2-btn about-btn">PERFIL</Link>
          <Link to="/mapview" className="btn custom2-btn">CREAR</Link>
          <Link to="/eventos" className="btn custom2-btn">EVENTOS</Link>
          <Link to="/myEvents" className="btn custom2-btn">MIS EVENTOS</Link>
        </div>

        <div className="d-flex align-items-center gap-2 ms-auto">
          <button className="btn custom2-btn" onClick={handleLogOut}>
            CERRAR SESIÓN
          </button>
        </div>
      </div>
    </nav>
  );
};
