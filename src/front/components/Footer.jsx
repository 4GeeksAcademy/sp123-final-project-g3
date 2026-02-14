import "../index.css";

export default function Footer() {
	return (
		<footer className="app-footer">
			<div className="footer-container">
				<div className="footer-col">
					<h4 className="footer-col__title">¡Futuro nombre super chulo!</h4>
					<p className="footer-col__text">
						Gestiona y organiza tus postulaciones de empleo de forma sencilla y
						visual.
					</p>
				</div>

				<div className="footer-col">
					<h5 className="footer-col__title">Navegación</h5>
					<ul className="footer-col__list">
						<li className="footer-col__item">
							<a href="/" className="footer-col__link">Inicio</a>
						</li>
						<li className="footer-col__item">
							<a href="/estadisticas" className="footer-col__link">Estadísticas</a>
						</li>
						<li className="footer-col__item">
							<a href="/perfil" className="footer-col__link">Perfil</a>
						</li>
						<li className="footer-col__item">
							<a href="/buscar" className="footer-col__link">Postulaciones</a>
						</li>
					</ul>
				</div>

				<div className="footer-col">
					<h5 className="footer-col__title">Legal</h5>
					<ul className="footer-col__list">
						<li className="footer-col__item">
							<a href="#" className="footer-col__link">Términos y condiciones</a>
						</li>
						<li className="footer-col__item">
							<a href="#" className="footer-col__link">Política de privacidad</a>
						</li>
						<li className="footer-col__item">
							<a href="#" className="footer-col__link">Contacto</a>
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
