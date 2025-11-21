import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import logo from "../assets/img/logofooter.png";

export const Footer = () => {
  const [email, setEmail] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      alert(data.message);
      setEmail("");
    } catch (err) {
      console.error(err);
      alert("Ooo o!");
    }
  };

  return (
    <>
      {/* --- CTA NEWSLETTER --- */}
      <section className="footer-cta">
        <h2>Mantente en contacto</h2>
        <p>Suscríbete a nuestro newsletter para recibir noticias y novedades:</p>
        <form className="newsletter-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Suscribirme</button>
        </form>
      </section>


      <div className="footer-line"></div>



      <footer className="footer">
        <div className="container">
          <div className="row">


            <div className="col-12 col-md-3 mt-5">
              <h4>
                <img src={logo} alt="MeetFit Logo" className="footer-logo" />MeetFit
              </h4>
              <p>
                Calle de la Innovación, 24, 3ºB<br />
                27037 Madrid, España
              </p>
            </div>

            <div className="col-12 col-md-3 mt-5">
              <h4>Contactos</h4>
              <p>Email: meetfitfspt119@gmail.com</p>
              <p>Tel: +34 123 456 789</p>
            </div>

            <div className="col-12 col-md-3 mt-5">
              <h4>Enlaces útiles</h4>
              <ul>
                <li><Link to="/terms">Términos y Condiciones</Link></li>
                <li><Link to="/privacy">Política de Privacidad</Link></li>
                <li><Link to="/faq">Preguntas Frecuentes</Link></li>
              </ul>

            </div>

            <div className="col-12 col-md-3 mt-5">
              <h4>Navegación</h4>
              <ul>
                <li><Link to="/home">Inicio</Link></li>
                <li><Link to="/about">Sobre Nosotros</Link></li>
                <li><Link to="/mapview">Mapa</Link></li>


              </ul>
            </div>

          </div>
        </div>



        <section className="footer-follow">
          <h3>Síguenos</h3>
          <div className="social-icons">
            <a href="https://github.com/JuanjoVillarejo" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="https://github.com/NatiSen" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="https://github.com/Sergioalv15" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
            <a href="https://github.com/SashaGIT2904" aria-label="Twitter"><i className="fab fa-x-twitter"></i></a>
          </div>
        </section>


        <div className="footer-bottom">
          <p>Copyright ©2025 MeetFit. All rights reserved.</p>
        </div>
      </footer >
    </>
  );
};
