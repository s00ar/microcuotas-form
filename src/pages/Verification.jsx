import "../css/Verification.css";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import Banner from "../components/Header";
import Footer from '../components/Footer';

function Verification() {
  const user = useAuthState(auth);
  const navigate = useNavigate();
  const [cuit, setCuit] = useState("");
  const [cuitError, setCuitError] = useState("");

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
      setCuitError("CUIT already registered within the last 30 days. You can only submit one form each 30 days.");
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
        setCuit(userData[0].cuit);
        console.log(userData[0].cuit);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [user]);

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
        </div>
        <div className="row">
          <input
          className="verification__input"
          type="text"
          placeholder="CUIT"
          onChange={(e) => setCuit(e.target.value)}
          />
          {cuitError && <span className="error">{cuitError}</span>}
          <button
            className="btn"
            onClick={() => {
              if (cuit) {
                checkCuitAvailability();
                if (!cuitError) {
                  navigate("/clientform");
                }
              }
            }}
          >Solicitar crédito
          </button>
        </div>
      </div>
    <div className="footer__container">
      <Footer />
    </div>
  </div>
  );
}

export default Verification;
