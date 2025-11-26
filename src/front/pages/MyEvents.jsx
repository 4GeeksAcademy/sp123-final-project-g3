import React from 'react'
import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import TextInput from "../components/TextInput";
import { login } from "../jsApiComponents/auth"
import { Button } from 'react-bootstrap';
import bgImg from "../assets/img/background-screens.png";
import JoinedEvents from '../components/JoinedEvents';
import CreatedEvents from '../components/CreatedEvents';

export default function MyEvents() {
    return (
        <div
            className="auth-theme container-fluid  "
            style={{
                backgroundImage: `url(${bgImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
            }}
        >
      <div className="row text-center justify-content-evenly align-items-center " style={{ minHeight: "100vh" }}>
        <div className="auth-card-sergio col-12 col-lg-6 ">
          <JoinedEvents></JoinedEvents>
        </div>
        <div className="auth-card-sergio col-12 col-lg-6"><CreatedEvents></CreatedEvents></div>

      </div>
    </div>
    )
}


