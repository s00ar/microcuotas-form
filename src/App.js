import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Reset from "./pages/Reset";
import Register from "./pages/Register";
import Report from "./pages/Report";
import Dashboard from "./pages/Dashboard";
import './css/App.css';
import firebaseApp from "./firebase";
import ClientForm from './pages/ClientForm';

const App = () => {
  return (
    <div className="App">
        <Router basename={process.env.PUBLIC_URL}>
          <Routes>
            <Route exact path="/" element={<Dashboard />} />
            <Route path="/clientform" element={<ClientForm />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/reset" element={<Reset />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/report" element={<Report />} />
          </Routes>
        </Router>
    </div>
  );
};

export default App;