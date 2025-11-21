import React from "react";
import "./About.css"; // używamy CSS z About, żeby zachować styl

export const Privacy = () => {
  return (
    <div className="about-page">
      <div className="about-title" style={{ textAlign: "center" }}>
        <h1 className="meetfit-title">Política de Privacidad</h1>
      </div>

      <div
        className="about-text-container"
        style={{
          textAlign: "left",
          maxWidth: "800px",
          width: "90%",
          margin: "0 auto"
        }}
      >
        <p className="about-text">
          En MeetFit valoramos tu privacidad y nos comprometemos a proteger tus datos personales. 
          Por favor, revisa esta política para entender cómo recopilamos, usamos y protegemos tu información.
        </p>

        <ol style={{ paddingLeft: "1.5rem", textAlign: "left" }}>
          <li style={{ marginBottom: "1.8rem", lineHeight: "1.7" }}>
            <strong style={{ color: "#E3FE18" }}>Recopilación de datos:</strong> Recopilamos información personal como nombre, correo electrónico y preferencias de usuario al registrarte o usar nuestros servicios.
          </li>
          <li style={{ marginBottom: "1.8rem", lineHeight: "1.7" }}>
            <strong style={{ color: "#E3FE18" }}>Uso de los datos:</strong> La información recopilada se utiliza para mejorar la experiencia de usuario, enviar notificaciones y personalizar contenidos.
          </li>
          <li style={{ marginBottom: "1.8rem", lineHeight: "1.7" }}>
            <strong style={{ color: "#E3FE18" }}>Protección de datos:</strong> Implementamos medidas de seguridad técnicas y administrativas para proteger tus datos contra accesos no autorizados.
          </li>
          <li style={{ marginBottom: "1.8rem", lineHeight: "1.7" }}>
            <strong style={{ color: "#E3FE18" }}>Compartir información:</strong> No compartimos tus datos personales con terceros sin tu consentimiento, salvo requerimiento legal.
          </li>
          <li style={{ marginBottom: "1.8rem", lineHeight: "1.7" }}>
            <strong style={{ color: "#E3FE18" }}>Actualizaciones:</strong> Esta política puede actualizarse ocasionalmente. Te recomendamos revisarla periódicamente.
          </li>
        </ol>
      </div>
      <div>
        <p className="about-text" style={{ marginTop: "2rem", fontStyle: "italic" }}>
          Fecha de última actualización: 3 de diciembre de 2025
        </p>
      </div>
    </div>
  );
};
