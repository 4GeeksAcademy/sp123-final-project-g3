import { Link } from "react-router-dom";

export const Navbar = () => {

	return (
		<nav className="navbar dashboard-navbar">
			<div className="navbar-left">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">
						<img src='https://res.cloudinary.com/dmx0zjkej/image/upload/v1762540958/LOGO_600_x_600_muoehy.png'
							className='logo' />
					</span>
				</Link>
				<div className="search-bar">
					<i className="fas fa-search"></i>
					<input type="text" placeholder="Buscar entre lista de tareas..." />
				</div>
			</div>
			<div className="navbar-right">
				<div className="navbar-icons">
					<i className="fas fa-bell"></i>
					<i className="fas fa-envelope"></i>
					<i className="fas fa-calendar-alt" onClick={() => navigate("/calendar")} style={{ cursor: "pointer" }}></i>
					<i className="fas fa-question-circle"></i>
				</div>
				<div class="dropdown">
					<button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
						Acceso
					</button>
					<ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton1">
						<Link to="/login">
						<li><a class="dropdown-item" href="#">Iniciar Sesion</a></li>
						</Link>
						<Link to="/register">
						<li><a class="dropdown-item" href="#">Registro</a></li>
						</Link>
					</ul>
				</div>
			</div>
		</nav>
	);
};