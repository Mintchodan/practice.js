import "./App.css";

import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";

import LanginPage from "./components/views/LandingPage/LanginPage";
import LoginPage from "./components/views/LoginPage/LoginPage";
import RegisterPage from "./components/views/RegisterPage/RegisterPage";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route exact path="/" element={LanginPage()} />
          <Route exact path="/login" element={LoginPage()} />
          <Route exact path="/register" element={RegisterPage()} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
