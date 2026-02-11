import "../index.css";

export default function Footer() {
	return (
		<footer className="app-footer">
			<div className="footer-container">
				<div className="footer-col">
					<h4>¡Futuro nombre super chulo!</h4>
					<p>
						Gestiona y organiza tus postulaciones de empleo de forma sencilla y
						visual.
					</p>
				</div>

				<div className="footer-col">
					<h5>Navegación</h5>
					<ul>
						<li>
							<a href="/inicio">Inicio</a>
						</li>
						<li>
							<a href="/estadisticas">Estadísticas</a>
						</li>
						<li>
							<a href="/perfil">Perfil</a>
						</li>
						<li>
							<a href="/postulaciones">Postulaciones</a>
						</li>
					</ul>
				</div>

				<div className="footer-col">
					<h5>Legal</h5>
					<ul>
						<li>
							<a href="#">Términos y condiciones</a>
						</li>
						<li>
							<a href="#">Política de privacidad</a>
						</li>
						<li>
							<a href="#">Contacto</a>
						</li>
					</ul>
				</div>
			</div>

			<div className="footer-bottom">
				© {new Date().getFullYear()} "Futuro nombre". Todos los derechos
				reservados.
			</div>
		</footer>
	);
}
