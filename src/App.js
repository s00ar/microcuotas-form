import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Reset from "./pages/Reset";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import Report from "./pages/Report";
import Dashboard from "./pages/Dashboard";
import './css/App.css';
import firebaseApp from "./firebase";
// import ClientForm from './ClientForm';

const App = () => {
  return (
    <div className="App">
      <h1>Formulario de Solicitud de preaprobación</h1>
        <Router basename={process.env.PUBLIC_URL}>
          <Routes>
            <Route exact path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/reset" element={<Reset />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/admin" element={<Admin />} />
            <Route exact path="/report" element={<Report />} />
          </Routes>
        </Router>
      {/* <ClientForm /> */}
    </div>
  );
};

export default App;