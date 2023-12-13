import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/Footer.css';

function Footer() {

return (
    <div className='footer-container'>
        <Link to="/dashboard">
            <button className='btn-reiniciar'>Reiniciar formulario</button>
        </Link>
    </div>

)
}

export default Footer