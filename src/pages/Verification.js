import "../css/Verification.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import Banner from "../components/Header";
import Footer from '../components/Footer';

function Verification() {
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const navigate = useNavigate();
  const [showFooter, setShowFooter] = useState(true);
  const [showFullText, setShowFullText] = useState(false);
  const [checked, setChecked] = useState(false);
  const [cuit, setCuit] = useState("");
  const [cuitError, setCuitError] = useState("");

  const handleVerMasClick = () => {
    setShowFullText(!showFullText);
  };

  const handleCheckboxClick = () => {
    setChecked(!checked);
  };

  const fetchUserName = async () => {
    //   const uid = user && user.uid;
    const uid = "tT7ug3xg19d0h9YWjTivaJ0cWcY2";
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    const userData = [];
    querySnapshot.forEach((doc) => {
      userData.push(doc.data());
    });

    return userData;
  };

  const checkCuitAvailability = async () => {
    if (!cuit) return;

    const q = query(collection(db, "users"), where("cuit", "==", cuit));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.size > 0) {
      setCuitError("El CUIT ya está registrado. Solo se puede ingresar una solicitud cada 30 días");
      return;
    } else {
      setCuitError("");
      navigate("/clientform");      
    }
  };

  useEffect(() => {
    // write query to get all data from users collection
    const q = query(collection(db, "users"));
    getDocs(q).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
      });
    });

    fetchUserName()
      .then((userData) => {
        setName(userData[0].name);
        setMail(userData[0].email);
          setCuit(userData[0].cuit);
        console.log(userData[0].name, userData[0].email);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [user]);

  useEffect(() => {
    if (cuit) {
      checkCuitAvailability();

      if (cuitError) {
        setChecked(false);
      }
    }
  }, [cuit]);

  // useEffect(() => {
  //   if (loading) return;
  //   if (!user) return navigate("/login");
  //   fetchUserName();
  // }, [user, loading]);

  return (
  <div>
      <div className="banner__container">
        <Banner />
      </div>
      <div className="verification__container">
        <div className="row">
          <h2>
            Antes de comenzar por favor ingresa tu CUIT
          </h2>
          <input
          type="text"
          placeholder="CUIT"
          onChange={(e) => setCuit(e.target.value)}
          />
          {cuitError && <span className="error">{cuitError}</span>}
        </div>
        <div className="row">
          <button
            className={checked ? "btn" : "btn disabled"}
            onClick={() => {
              if (cuit) {
                checkCuitAvailability();
                if (!cuitError) {
                  navigate("/clientform");
                }
              }
            }}
            disabled={!checked}
          >Solicitar crédito
          </button>
        </div>
        <div className="row">
          <div className="row">
            <p className="datos-personales">
              Consentimiento para el uso de datos personales
              <input
                type="checkbox"
                id="checkbox"
                onChange={() => setChecked(!checked)}
              />
              <br />
              {checked ? "" : " (Debe seleccionar el checkbox)"}
              <br />
              <button onClick={handleVerMasClick}>
                {showFullText ? "Cerrar" : "Ver más"}
              </button>
              {showFullText && (
                <div>
                  <p className="datos-personales">
                    Continuar con el siguiente formulario expresa CONSENTIMIENTO
                    para el registro y uso de mis datos personales.
                  </p>
                </div>
              )}
            </p>
          </div>
        </div>
      </div>
    <div className="footer__container">
      <Footer />
    </div>
  </div>
  );
}

export default Verification;
