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
        </div>

         <div className="d-flex align-items-center gap-2 ms-2 left-menu">
          <Link to="/profile" className="btn custom2-btn about-btn">
            PERFIL
          </Link>
          <Link to="/mapview" className="btn custom2-btn">
            ACTIVIDADES
          </Link>
          <Link to="/eventos" className="btn custom2-btn">
            EVENTOS
          </Link>
          <Link to="/favorites" className="btn custom2-btn">
            FAVORITOS
          </Link>
        </div>

          {/* SEARCH BAR */}
          <div className="flex-grow-1 d-flex justify-content-center search-wrapper">
            <input
              type="text"
              placeholder="Buscar..."
              className="form-control"
              style={{ maxWidth: "250px" }}
            />
          </div>


          <div className="d-flex align-items-center gap-2 me-2 right-menu">
            <Link to="/home" className="btn custom-btn">
              INICIO
            </Link>
            <Link to="/about" className="btn custom-btn">
              SOBRE
            </Link>
            <Link to="/logout" className="btn custom2-btn">
              CERRAR SESIÓN
            </Link>
          </div>

        </div>
    </nav >
  );
};
