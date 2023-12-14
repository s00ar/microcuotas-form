import React, { useState } from 'react';
import { storage, db } from '../firebase';
import '../css/ClientForm.css';
import Banner from "../components/Header";
import Footer from '../components/Footer';

const ClientForm = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [cuil, setCuil] = useState('');
  const [telefono, setTelefono] = useState('');
  const [mail, setMail] = useState('');
  const [estadoCivil, setEstadoCivil] = useState('');
  const [hijos, setHijos] = useState('');
  const [ocupacion, setOcupacion] = useState('');
  const [ingresoMensual, setIngresoMensual] = useState('');
  const [antiguedad, setAntiguedad] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [dniFrente, setDniFrente] = useState(null);
  const [dniDorso, setDniDorso] = useState(null);
  const [retratoDni, setRetratoDni] = useState(null);

  const handleNombreChange = (e) => {
    setNombre(e.target.value);
  };

  const handleApellidoChange = (e) => {
    setApellido(e.target.value);
  };
  
  const handleCuilChange = (e) => {
    setCuil(e.target.value);
  };
  
  const handleTelefonoChange = (e) => {
    setTelefono(e.target.value);
  };
  
  const handleMailChange = (e) => {
    setMail(e.target.value);
  };
  
  const handleEstadoCivilChange = (e) => {
    setEstadoCivil(e.target.value);
  };
  
  const handleHijosChange = (e) => {
    setHijos(e.target.value);
  };
  
  const handleOcupacionChange = (e) => {
    setOcupacion(e.target.value);
  };
  
  const handleIngresoMensualChange = (e) => {
    setIngresoMensual(e.target.value);
  };
  
  const handleAntiguedadChange = (e) => {
    setAntiguedad(e.target.value);
  };
  
  const handleFechaNacimientoChange = (e) => {
    setFechaNacimiento(e.target.value);
  };
  const today = new Date();
  const fechaSolicitud = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();


  const handleDniFrenteChange = (e) => {
    const file = e.target.files[0];
    setDniFrente(file);
  };

  const handleDniDorsoChange = (e) => {
    const file = e.target.files[0];
    setDniDorso(file);
  };

  const handleRetratoDniChange = (e) => {
    const file = e.target.files[0];
    setRetratoDni(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Subir imágenes a Firebase Storage
    const uploadDniFrenteTask = storage.ref(`documentos/${dniFrente.name}`).put(dniFrente);
    // Continúa con las demás tareas de subida de imágenes

    // Luego de completar la subida de todas las imágenes, guardar datos en Firebase Database
    // Utiliza los datos capturados en los estados para enviarlos a la base de datos

    db.ref('clientes').push({
      nombre,
      apellido,
      cuil,
      telefono,
      mail,
      estadoCivil,
      hijos,
      ocupacion,
      ingresoMensual,
      antiguedad,
      fechaNacimiento,
      fechaSolicitud,
      dniFrente,
      dniDorso,
      retratoDni
    });
  };

  return (
    <div>
      <div className="banner__container">
        <Banner />
      </div>
      <h1 className='firsth1'>Solicitá tu crédito</h1>
      <form onSubmit={handleSubmit}>
        <div className='form__container' >
        <div className='form__container__leftpanel'>
        
            <label>
              Nombre:
              <input type="text" value={nombre} onChange={handleNombreChange} />
            </label>
            
          
            <label>
              Apellido:
              <input type="text" value={apellido} onChange={handleApellidoChange} />
            </label>
          
            <label>
              CUIL:
              <input type="text" value={cuil} onChange={handleCuilChange} />
            </label>
          
            <label>
              Teléfono:
              <input type="tel" value={telefono} onChange={handleTelefonoChange} />
            </label>
          
          <label>
            Correo electrónico:
            <input type="email" value={mail} onChange={handleMailChange} />
          </label>
          
          <label>
            Estado Civil:
            <select value={estadoCivil} onChange={handleEstadoCivilChange}>
              <option value="">-- Seleccione --</option>
              <option value="soltero">Soltero(a)</option>
              <option value="casado">Casado(a)</option>
              <option value="divorciado">Divorciado(a)</option>
              <option value="viudo">Viudo(a)</option>
            </select>
          </label>
          
          <label>
            Hijos:
            <select value={hijos} onChange={handleHijosChange}>
              <option value="">-- Seleccione --</option>
              <option value="true">Si</option>
              <option value="false">No</option>
            </select>
          </label>
        </div>
        <div className='form__container__rightpanel'>
          
          <label>
            Ocupación:
            <input type="text" value={ocupacion} onChange={handleOcupacionChange} />
          </label>
        
            <label>
              Ingreso mensual:
              <input type="number" value={ingresoMensual} onChange={handleIngresoMensualChange} />
            </label>
            
            <label>
              Antigüedad:
              <input type="number" value={antiguedad} onChange={handleAntiguedadChange} />
            </label>
            
            <label>
              Fecha de nacimiento:
              <input type="date" value={fechaNacimiento} onChange={handleFechaNacimientoChange} />
            </label>
            
              <label>
                DNI Frente:
                <input type="file" onChange={handleDniFrenteChange} />
              </label>
            
              <label>
                DNI Dorso:
                <input type="file" onChange={handleDniDorsoChange} />
              </label>
            
              <label>
                Retrato + DNI:
                <input type="file" onChange={handleRetratoDniChange} />
              </label>
            </div>
          </div>
        <button className='form__btn' type="submit">Enviar</button>
      </form>

      <div className="footer__container">
        <Footer />
      </div>
    </div>
  );
};

export default ClientForm;