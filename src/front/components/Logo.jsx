// src/components/Logo.jsx
import React from "react";
import logo from "../assets/img/logo.svg"; 

export const Logo = ({ width = 80, height = 80 }) => {
  return <img src={logo} alt="MeetFit Logo" width={width} height={height} />;
};
