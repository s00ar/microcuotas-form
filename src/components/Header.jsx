import React from 'react';
import Logo from '../assets/logo_textoblanco_fondotransp.png';
import '../css/Header.css';

function Header() {
  return (
    <div className="header">
      <img src={Logo} />
      <div className="barra-navegacion">
        <a href="#">Inicio</a>
        <a href="#">Sobre nosotros</a>
        <a href="#">Contacto</a>
      </div>
    </div>
  );
}

export default Header;
