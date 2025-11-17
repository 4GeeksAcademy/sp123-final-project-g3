import React, { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import "./Home.css";
import logo from "../assets/img/logohome.png";

export const Home = () => {
  const { store, dispatch } = useGlobalReducer();

  const loadMessage = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file");

      const response = await fetch(backendUrl + "/api/hello");
      const data = await response.json();

      if (response.ok) {
        dispatch({ type: "set_hello", payload: { message: data.message, quote: data.quote } });
      }


      return data;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadMessage();


    const interval = setInterval(() => {
      loadMessage();
    }, 10000);

    return () => clearInterval(interval);
  }, []);


  return (
    <div className="home-page">
      <img src={logo} alt="MeetFit Logo" className="home-logo" />

      <h1 className="home-title">Bienvenido a <span className="home-title-highlight">MeetFit</span></h1>

      <p className="home-text">
        Conecta, entrena y crece junto a personas que comparten tu pasión por el deporte.
      </p>

      <div className="home-message">
        {store.message ? (
          <span>{store.message.message}</span>
        ) : (
          <span className="text-muted">Loading message from the backend...</span>
        )}
      </div>

      {store.message && (
        <div className="home-extra-box">
          <p>Queremos decirte que...</p>
          <strong>{store.message.quote}</strong>
        </div>
      )}


    </div>
  );
};
