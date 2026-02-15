import "../index.css";

export default function Footer() {
	return (
		<footer className="app-footer">
			<div className="footer-container">
				<div className="footer-col">
					<h4 className="footer-col__title">Super cool future name!</h4>
					<p className="footer-col__text">
						Manage and organize your job applications easily and visually.
					</p>
				</div>

				<div className="footer-col">
					<h5 className="footer-col__title">Navigation</h5>
					<ul className="footer-col__list">
						<li className="footer-col__item">
							<a href="/" className="footer-col__link">Home</a>
						</li>
						<li className="footer-col__item">
							<a href="/statistics" className="footer-col__link">Statistics</a>
						</li>
						<li className="footer-col__item">
							<a href="/profile" className="footer-col__link">Profile</a>
						</li>
						<li className="footer-col__item">
							<a href="/search" className="footer-col__link">Postulations</a>
						</li>
					</ul>
				</div>

				<div className="footer-col">
					<h5 className="footer-col__title">Legal</h5>
					<ul className="footer-col__list">
						<li className="footer-col__item">
							<a href="#" className="footer-col__link">Terms and conditions</a>
						</li>
						<li className="footer-col__item">
							<a href="#" className="footer-col__link">Privacy policy</a>
						</li>
						<li className="footer-col__item">
							<a href="#" className="footer-col__link">Contact</a>
						</li>
					</ul>
				</div>
			</div>

			<div className="footer-bottom">
				© {new Date().getFullYear()} "Future name". All rights reserved.
			</div>
		</footer>
	);
}
