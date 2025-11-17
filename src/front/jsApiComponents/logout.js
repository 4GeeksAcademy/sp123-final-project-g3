import React from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export default function UseLogOut() {

  const navigate = useNavigate();
  const LogOut = () => {
    localStorage.removeItem(JWT_STORAGE_KEY);
    navigate("/");
  };
  return LogOut;
}
// 
