import React, { useState } from 'react';
import { storage, db } from '../firebase';
import '../css/ClientForm.css';
import Banner from "../components/Header";
import Footer from '../components/Footer';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from "react-router-dom";
import cuilContext from '../App'; 
import { useContext } from 'react';

const ClientForm = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const cuil = useContext(cuilContext); // Obtiene el valor del contexto
  const [telefono, setTelefono] = useState('');
  const [telefonoLab, setTelefonoLab] = useState('');
  const [mail, setMail] = useState('');
  const [estadoCivil, setEstadoCivil] = useState('');
  const [hijos, setHijos] = useState('');
  const [ocupacion, setOcupacion] = useState('');
  const [ingresoMensual, setIngresoMensual] = useState('');
  const [fechaIngreso, setFechaIngreso] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [dniFrente, setDniFrente] = useState(null);
  const [dniDorso, setDniDorso] = useState(null);
  const [retratoDni, setRetratoDni] = useState(null);
  const navigate = useNavigate();

  const handleNombreChange = (e) => {
    setNombre(e.target.value);
  };

  const handleApellidoChange = (e) => {
    setApellido(e.target.value);
  };

  const handleTelefonoChange = (e) => {
    if (!isNaN(Number(e.target.value)) ) {
      setTelefono(e.target.value);
      } else {
        alert("El campo de teléfono debe ser un número");
      }
  };

  const handleTelefonoLabChange = (e) => {
    const value = e.target.value;

    // Verifica que el valor sea un número de teléfono de Argentina
    if (!value.match(/^[11|15]\d{9}$/)) {
      alert("El campo de teléfono laboral debe ser un número de Argentina");
      return;
    }
  
    // Setea el valor
    setTelefonoLab(value);
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
    setFechaIngreso(e.target.value);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any of the required fields is empty
    if (
      !nombre ||
      !apellido ||
      !cuil ||
      !telefono ||
      !telefonoLab ||
      !mail ||
      !estadoCivil ||
      !hijos ||
      !ocupacion ||
      !ingresoMensual ||
      !fechaIngreso ||
      !fechaNacimiento ||
      !fechaSolicitud ||
      !dniFrente ||
      !dniDorso ||
      !retratoDni
    ) {
      alert('Please fill all the fields');
      return;
    }

    try {
      // Upload images to Firebase Storage
      const dniFrenteRef = ref(storage, `documentos/${dniFrente.name}`);
      const dniDorsoRef = ref(storage, `documentos/${dniDorso.name}`);
      const retratoDniRef = ref(storage, `documentos/${retratoDni.name}`);

      const uploadDniFrenteTask = uploadBytes(dniFrenteRef, dniFrente);
      const uploadDniDorsoTask = uploadBytes(dniDorsoRef, dniDorso);
      const uploadRetratoDniTask = uploadBytes(retratoDniRef, retratoDni);

      // Wait for all uploads to complete
      await Promise.all([uploadDniFrenteTask, uploadDniDorsoTask, uploadRetratoDniTask]);

      // Get download URLs for the images
      const dniFrenteURL = await getDownloadURL(dniFrenteRef);
      const dniDorsoURL = await getDownloadURL(dniDorsoRef);
      const retratoDniURL = await getDownloadURL(retratoDniRef);

      // Save data to Firebase Firestore
      const clientesCollection = collection(db, 'clientes');
      //added timestamp with form
      const timestamp = serverTimestamp();
      await addDoc(clientesCollection, {
        nombre,
        apellido,
        cuil,
        telefono,
        telefonoLab,
        mail,
        estadoCivil,
        hijos,
        ocupacion,
        ingresoMensual,
        fechaIngreso,
        fechaNacimiento,
        fechaSolicitud,
        dniFrente: dniFrenteURL,
        dniDorso: dniDorsoURL,
        retratoDni: retratoDniURL,
        timestamp
      });

      // Clear all fields after successful submission
      setNombre('');
      setApellido('');
      setTelefono('');
      setMail('');
      setEstadoCivil('');
      setHijos('');
      setOcupacion('');
      setIngresoMensual('');
      setFechaIngreso('');
      setFechaNacimiento('');
      setDniFrente(null);
      setDniDorso(null);
      setRetratoDni(null);

      alert('Data submitted successfully!');
      navigate("/");

    } catch (error) {
      console.error('Error submitting data:', error);
      alert('An error occurred while submitting data');
    }
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
              <p>{cuil}</p>
            </label>
            <label>
              Teléfono laboral:
              <input type="tel" value={telefonoLab} onChange={handleTelefonoLabChange} />
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
              Fecha de Ingreso a su actual empleo (Antigüedad):
              <input type="date" value={fechaIngreso} onChange={handleAntiguedadChange} />
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
        <div classname="statement__text">

            Una vez que su solicitud de crédito sea aprobada por nuestro equipo de evaluación, un representante comercial de Microcuotas se comunicará con usted para solicitarle cualquier documentación adicional necesaria.

          La transferencia del dinero se realizará previa firma del solicitante en la sucursal de Microcuotas, donde se le entregará su carpeta de crédito con todos los detalles de su préstamo.

          Este texto podría ampliarse de la siguiente manera:

          Una vez que Microcuotas reciba la documentación solicitada, se procederá a la transferencia del dinero a su cuenta bancaria. La transferencia se realizará en un plazo máximo de 24 horas hábiles.

          Para completar la transferencia, deberá firmar su carpeta de crédito en la sucursal de Microcuotas. En la carpeta de crédito encontrará todos los detalles de su préstamo, como el monto, el plazo, la tasa de interés y las cuotas.

        </div>
      </form>
      <div className="footer__container">
        <Footer />
      </div>
    </div>
  );
};

export default ClientForm;