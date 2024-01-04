import "../css/Verification.css";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { db } from "../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import Banner from "../components/Header";
import Footer from '../components/Footer';

function Verification() {
  const navigate = useNavigate();
  const [cuil, setCuil] = useState("");

  const [cuilError, setCuilError] = useState("");

  const checkCuilAvailability = async () => {
    try {
      if (!cuil) {
        alert("CUIL field is empty");
        return;
      }

      if (cuil.length !== 11) {
        alert("CUIL should have 11 characters");
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
              setCuilError("CUIL already registered within the last 30 days. You can only submit one form every 30 days.");
            } else {
              setCuilError("");
              navigate("/clientform");
            }
          } else {
            console.error('Timestamp is undefined for document with CUIL:', cuil);
          }
        });
      } else {
        // CUIL is not present in the database
        setCuilError("");
        navigate("/clientform");
      }
    } catch (error) {
      console.error('Error checking CUIL availability:', error);
      // Handle the error as needed
    }
  };

  return (
    <div>
      <div className="banner__container">
        <Banner />
      </div>
      <div className="verification__container">
        <div className="row">
          <h2>
            Antes de comenzar por favor ingresa tu cuil
          </h2>
        </div>
        <div className="row">
          <input
            className="verification__input"
            type="text"
            placeholder="cuil"
            onChange={(e) => setCuil(e.target.value)}
          />
          {cuilError && <span className="error">{cuilError}</span>}
          <button
            className="btn"
            onClick={checkCuilAvailability}
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
