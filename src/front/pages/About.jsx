import React from "react";
import "./About.css"; 
import logo from "../assets/img/logohome.png";


export const About = () => {
  return (
    <div className="about-page">
       <img src={logo} alt="MeetFit Logo" className="about-logo" />
      <h1 className="about-title">
        <span className="sobre-box">sobre</span>
        <span className="meetfit-title">MeetFit</span>
      </h1>

      <div className="about-text-container">
        
        <p className="about-text">
          MeetFit nació como proyecto final del bootcamp de 4Geeks Academy, creado por un equipo multicultural formado por tres españoles y una tártara unidos por una misma pasión: el deporte.
        </p>
        <p className="about-text">
          Nuestra misión es conectar a personas activas que disfrutan del ejercicio en todas sus formas —desde correr o hacer yoga hasta escalar o montar en bici. Queremos ayudarles a encontrar compañeros, motivación y comunidad.
        </p>
        <p className="about-text">
          Creemos que mantenerse en forma es más fácil y divertido cuando lo haces acompañado. Por eso desarrollamos MeetFit, una app pensada para unir a la gente a través del movimiento.
        </p>
        
      </div>
    </div>
  );
};
