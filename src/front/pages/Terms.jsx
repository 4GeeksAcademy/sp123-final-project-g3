import React from "react";
import "./About.css"; // używamy tego samego CSS co About

export const Terms = () => {
  return (
    <div className="about-page">
      <div className="about-title" style={{ textAlign: "center" }}>
        <h1 className="meetfit-title">Términos y Condiciones</h1>
      </div>

      <div
        className="about-text-container"
        style={{ 
          textAlign: "left", 
          maxWidth: "800px", // zwiększona szerokość
          width: "90%",      // dynamiczna szerokość
          margin: "0 auto"   // wycentrowanie kontenera
        }}
      >
        <p className="about-text">
          Bienvenido a MeetFit. Al usar nuestra plataforma, aceptas estos términos y condiciones. 
          Por favor, léelos con atención para entender tus derechos y responsabilidades.
        </p>

        <ol style={{ paddingLeft: "1.5rem", textAlign: "left" }}>
          <li style={{ marginBottom: "1.8rem", lineHeight: "1.7" }}>
            <strong style={{ color: "#E3FE18" }}>Uso de la plataforma:</strong> MeetFit conecta personas interesadas en actividades deportivas. 
            No nos hacemos responsables del comportamiento de otros usuarios.
          </li>
          <li style={{ marginBottom: "1.8rem", lineHeight: "1.7" }}>
            <strong style={{ color: "#E3FE18" }}>Registro y seguridad:</strong> Al registrarte, proporcionas información verdadera y actualizada. 
            Eres responsable de la seguridad de tu cuenta y contraseña.
          </li>
          <li style={{ marginBottom: "1.8rem", lineHeight: "1.7" }}>
            <strong style={{ color: "#E3FE18" }}>Contenido del usuario:</strong> Todos los contenidos que publiques son responsabilidad del autor. 
            MeetFit puede eliminar cualquier contenido inapropiado.
          </li>
          <li style={{ marginBottom: "1.8rem", lineHeight: "1.7" }}>
            <strong style={{ color: "#E3FE18" }}>Privacidad:</strong> Tus datos personales se gestionan según nuestra Política de Privacidad. 
            No compartimos tu información sin tu consentimiento.
          </li>
          <li style={{ marginBottom: "1.8rem", lineHeight: "1.7" }}>
            <strong style={{ color: "#E3FE18" }}>Modificaciones:</strong> MeetFit puede actualizar estos términos en cualquier momento. 
            Es tu responsabilidad revisar los cambios periódicamente.
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
