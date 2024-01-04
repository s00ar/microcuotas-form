import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { createContext, useContext } from 'react';
import Login from "./pages/Login";
import Reset from "./pages/Reset";
import Register from "./pages/Register";
import Report from "./pages/Report";
import Verification from "./pages/Verification";
import './css/App.css';
import firebaseApp from "./firebase";
import ClientForm from './pages/ClientForm';

const App = () => {
  const [cuil, setCuil] = useState("");
  // Create a context for the cuil state and dispatch function
  const CuilContext = createContext();
  //create a context for a standard value
  // const cuilContext = React.createContext();

  return (
    <CuilContext.Provider value={{ cuil, setCuil }}>
    <div className="App">
        <Router basename={process.env.PUBLIC_URL}>
          <Routes>
            <Route exact path="/" element={<Verification />} />
            <Route path="/clientform" element={<ClientForm />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/reset" element={<Reset />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/report" element={<Report />} />
          </Routes>
        </Router>
        </div>
    </CuilContext.Provider>
  );
};

export default App;