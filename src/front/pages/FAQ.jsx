import React, { useState } from "react";
import "./About.css";

const faqData = [
  {
    question: "¿Cómo me registro en MeetFit?",
    answer: "Haz clic en el botón 'ÚNETE' en la página principal y completa el formulario con tus datos."
  },
  {
    question: "¿Puedo cambiar mi perfil?",
    answer: "Sí, puedes actualizar tu información personal desde la sección 'PERFIL' después de iniciar sesión."
  },
  {
    question: "¿Cómo puedo ver eventos y actividades?",
    answer: "Todas las actividades y eventos están disponibles en la sección 'ACTIVIDADES' y 'EVENTOS'."
  },
  {
    question: "¿Qué hacer si olvido mi contraseña?",
    answer: "Haz clic en 'Olvidé mi contraseña' en la página de inicio de sesión y sigue las instrucciones para restablecerla."
  },
  {
    question: "¿Cómo se protegen mis datos?",
    answer: "Tus datos se gestionan según nuestra Política de Privacidad, con medidas de seguridad para proteger tu información."
  },
  {
    question: "¿Puedo eliminar mi cuenta?",
    answer: "Sí, puedes solicitar la eliminación de tu cuenta contactando con nuestro soporte."
  },
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="about-page">
      <div className="about-title" style={{ textAlign: "center" }}>
        <h1 className="meetfit-title">Preguntas Frecuentes</h1>
      </div>

      <div
        className="about-text-container"
        style={{ textAlign: "left", maxWidth: "800px", width: "90%", margin: "0 auto" }}
      >
        {faqData.map((item, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "#2A2D3E", // ciemne tło boxa
              borderRadius: "10px",
              padding: "1rem 1.5rem",
              marginBottom: "1rem",
              boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onClick={() => toggleIndex(index)}
          >
            <div style={{ fontWeight: "bold", color: "#E3FE18", fontSize: "1.1rem" }}>
              {item.question}
            </div>
            {openIndex === index && (
              <div style={{ marginTop: "0.5rem", color: "#FFFFFF", lineHeight: "1.6" }}>
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      
     <div>
        <p className="about-text" style={{ marginTop: "2rem", fontStyle: "italic" }}>
          Fecha de última actualización: 3 de diciembre de 2025
        </p>
      </div>
    </div>
  );
};
