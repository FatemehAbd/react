import "./App.css";
import React from "react";
import { Routes, Route } from "react-router-dom";

import WelcomePage from "./pages/WelcomePage";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import MainPage from "./pages/MainPage";

import ContactPv from "./pages/ContactPv";

function App() {
  return (
    <React.Fragment>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/main-page" element={<MainPage />}/>
        <Route path="/contacts/:slug" element={<ContactPv />} />
      </Routes>
    </React.Fragment>
  );
}

export default App;
