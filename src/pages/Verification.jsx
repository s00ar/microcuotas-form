import "../css/Verification.css";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import Banner from "../components/Header";

function Verification(props) {
  const navigate = useNavigate();
  const [cuil, setCuil] = useState("");
  const [cuilError, setCuilError] = useState('');
  const [cuotas, setCuotas] = useState('');
  const [monto, setMonto] = useState('');
  const [clienteRecurrente, setClienteRecurrente] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlCuotas = urlParams.get("cuotas");
    const urlMonto = urlParams.get("monto");

    if (urlCuotas) {
      setCuotas(urlCuotas);
    }
    if (urlMonto) {
      setMonto(urlMonto);
    }
  }, []); // Run the effect only once on component mount
  
  const checkCuilAvailability = async () => {
    try {
      if (!cuil) {
        alert("CUIL no puede estar en blanco");
        return;
      }
      if (!monto) {
        alert("El monto no puede estar en blanco");
        return;
      }
      if (!cuotas) {
        alert("La cantidad de cuotas no puede estar en blanco");
        return;
      }

      if (cuil.length !== 11) {
        alert("Ingresa un CUIL válido");
        return;
      }

      const q = query(collection(db, 'clientes'), where('cuil', '==', cuil));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.size > 0) {
        // CUIL is present in the database
        querySnapshot.forEach((doc) => {

          const timestampData = doc.data().timestamp;
          const timestamp = timestampData ? timestampData.toDate() : null; //Date in which the form has been created
          if (timestamp) { 
            const last30Days = 30 * 24 * 60 * 60 * 1000; //Equal to 30 days

            if (Date.now() - timestamp < last30Days) {
              setCuilError("El CUIL ya fué registrado en los últimos 30 días. Solamente se puede ingresar una solicitud cada 30 días.");
            } else {
              setCuilError("");
              navigate("/clientform", { state: { cuil } });
            }
          } else {
            console.error('Timestamp is undefined for document with CUIL:', cuil);
          }
        });
      } else {
        // CUIL is not present in the database
        setCuilError("");
        navigate("/clientform", { state: { cuil, cuotas, monto } });
      }
    } catch (error) {
      console.error('Error checking CUIL availability:', error);
      // Handle the error as needed
    }
  };

  const handleCuotasChange = (e) => {
    const newValue = e.target.value;
    if (!clienteRecurrente && newValue >= 2 && newValue <= 6) {
      setCuotas(newValue);
    } else if (clienteRecurrente && newValue >= 2 && newValue <= 12) {
      setCuotas(newValue);
    }
  };

  const handleMontoChange = (e) => {
    const newValue = e.target.value;
    if (!clienteRecurrente && newValue >= 10000 && newValue <= 100000) {
      setMonto(newValue);
    } else if (clienteRecurrente && newValue >= 10000 && newValue <= 200000) {
      setMonto(newValue);
    }
  };

  const handleClienteRecurrente = () => {
    setClienteRecurrente(!clienteRecurrente);
    setMonto(""); 
    setCuotas("");
  }

  return (
    <div>
      <div className="banner__container">
        <Banner />
      </div>
      <div className="verification__container">
        <div className="verification__container__leftpanel">
            <h2>
              Por favor ingresa tu cuil
            </h2>
            <input
              className="verification__input"
              type="text"
              placeholder="Ingresa tu cuil"
              onChange={(e) => setCuil(e.target.value)}
              />
            <h2 htmlFor="cuotas">Cantidad de Cuotas:</h2>
            <input
              className="verification__input"
              placeholder="6 cuotas"
              id="cuotas"
              type="number"
              min="2"
              max={clienteRecurrente ? 12 : 6}
              value={cuotas}
              onChange={handleCuotasChange}
              />
            <h2 htmlFor="monto">Monto Solicitado:</h2>
            <input
              className="verification__input"
              placeholder="$100.000 pesos"
              id="monto"
              type="number"
              min="10000"
              step="5000"
              max={clienteRecurrente ? 250000 : 125000}
              value={monto}
              onChange={handleMontoChange}
              />
            </div>
          <div className="verification__container__rightpanel">
            <div className="row">
              <label>
                ¿Es usted un cliente recurrente?
                <input
                  className="checkbox"
                  type="checkbox"
                  checked={clienteRecurrente}
                  onChange={handleClienteRecurrente}
                  />
              </label>
              </div>
              <div className="row">
                <button
                  className="btn"
                  onClick={checkCuilAvailability}
                  >Solicitar crédito
                </button>
                </div>
            </div>
        </div>
                {cuilError && alert(cuilError)}
    </div>
  );
}

export default Verification;
