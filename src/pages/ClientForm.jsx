import React, { useState } from 'react';
import { storage, database } from '../firebase';

const FormularioCliente = () => {
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [cuil, setCuil] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [estadoCivil, setEstadoCivil] = useState('');
  const [hijos, setHijos] = useState('');
  const [dniFrente, setDniFrente] = useState(null);
  const [dniDorso, setDniDorso] = useState(null);
  const [retratoDni, setRetratoDni] = useState(null);
  const [ingreso, setIngreso] = useState('');
  const [aniosTrabajo, setAniosTrabajo] = useState('');
  const [imagenURL, setImagenURL] = useState('');

  const handleNombreChange = (e) => {
    setNombre(e.target.value);
  };

  const handleEdadChange = (e) => {
    setEdad(e.target.value);
  };

  // Implementa métodos handle para los cambios en los demás campos

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
    // Ejemplo:
    database.ref('clientes').push({
      nombre,
      edad,
      cuil,
      telefono,
      correo,
      estadoCivil,
      hijos,
      // Añade los demás campos aquí
    });
  };

  return (
    <div>
      <h1>Formulario de Cliente</h1>
      <form onSubmit={handleSubmit}>
        {/* Agrega los campos restantes al formulario */}
        <label>
          Nombre:
          <input type="text" value={nombre} onChange={handleNombreChange} />
        </label>
        {/* Agrega los demás campos aquí */}
        <br />
        <label>
          DNI Frente:
          <input type="file" onChange={handleDniFrenteChange} />
        </label>
        {/* Agrega los demás campos de carga de imagen aquí */}
        <br />
        <button type="submit">Enviar</button>
      </form>
      {/* Visualización de imágenes subidas */}
      {imagenURL && (
        <div>
          <h2>Documento Subido:</h2>
          <img src={imagenURL} alt="Documento Subido" />
        </div>
      )}
    </div>
  );
};

export default FormularioCliente;