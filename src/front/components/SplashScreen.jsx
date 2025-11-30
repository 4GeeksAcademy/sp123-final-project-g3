import React, { useState, useEffect } from "react";
import "./SplashScreen.css";

const phase1Slogans = ["Sport.", "Connect.", "Explore."];

const SplashScreen = ({ onFinish }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < phase1Slogans.length) {
      const timer = setTimeout(() => setIndex(index + 1), 700); 
      return () => clearTimeout(timer);
    } else {
      
      const finishTimer = setTimeout(onFinish, 500); 
      return () => clearTimeout(finishTimer);
    }
  }, [index, onFinish]);

  return (
    <div className="splash-screen">
      {index < phase1Slogans.length && (
        <h1 className="splash-title">{phase1Slogans[index]}</h1>
      )}
    </div>
  );
};

export default SplashScreen;
