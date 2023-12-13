import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, fetchContactsData } from "../firebase";
import { useNavigate } from "react-router-dom";
import { query, collection, getDocs, where, addDoc } from "firebase/firestore";

export default function Admin() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [paginatedrecords, setpaginatedrecords] = useState([]);
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [page, setPage] = useState(0);

  const PAGESIZE =10

  useEffect(()=>{
    console.log(page)
    const min = page * PAGESIZE
    const max = (page * PAGESIZE) + PAGESIZE
    let _ =records.slice( min, max)
    setpaginatedrecords(_)
  }, [page])

  const checkAuth = async () => {
    //temporarily removed the checks for the user
    // if (!user) return navigate("/login");

    const uid = user && user.uid;
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const doc = await getDocs(q);
    const data = doc.docs[0].data();
    // if (!data.role === "admin") return navigate("/login");
    let rows = await fetchContactsData()
    setRecords(rows);
    setpaginatedrecords(rows.slice(0,PAGESIZE))
  };

  const getTime = (time) => {
    const fireBaseTime = new Date(
      time.seconds * 1000 + time.nanoseconds / 1000000,
    );
    const date = fireBaseTime.toDateString()+" " +fireBaseTime.toLocaleTimeString()
    return date;
  }
  
  const toExport = () => {
    let header = [
      
      "nombre",
      "edad",
      "cuil",
      "telefono",
      "correo",
      "estadoCivil",
      "hijos",
      "\n"
    ]
    let csvRows = records.map(e=>{
      let _ = []
      _[0] = e.name
      _[1] = e.age
      _[2] = e.id
      _[3] = e.telefono
      _[4] = e.correo
      _[5] = e.estadoCivil
      _[6] = e.hijos
      _[8] = getTime(e.timestamp)
      _[9]="\n"
      return _
  })  
      var pom = document.createElement('a');
      var blob = new Blob([header, ...csvRows],{type: 'text/csv;charset=utf-8;'});
      var url = URL.createObjectURL(blob);
      pom.href = url;
      pom.setAttribute('download', 'download.csv');
      pom.click();
  }

  useEffect(() => {
    if (loading) return;
    checkAuth();
    // enter()
  }, [user, loading]);

  console.log({ selected });

  const filterData = async() => {
    let rows = await fetchContactsData(startDate, endDate)
    setRecords(rows);
    setpaginatedrecords(rows)
  }

  return (
    <>
      <nav style={{ backgroundColor: "dark", color: "white" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px" }}>
          <h1 style={{ margin: "0" }}>Admin</h1>
          <a onClick={() => auth.signOut()} href="#" style={{ cursor: "pointer" }}>
            Logout
          </a>
        </div>
      </nav>
      <br />
      <div style={{display:'flex', justifyContent:'center'}}>
        <div style={{width:"80%", display:"flex", justifyContent:"space-between"}} >
          <div>
            <span>
              Start Date: <input type={"date"} value={startDate} onChange={e=>setStartDate(e.target.value)} /> 
              End Date: <input type={"date"} value={endDate} onChange={e=>setEndDate(e.target.value)} />
              <button onClick={filterData}>filter</button>
            </span>
          </div>
          <div>
            <button disabled={records.length===0} onClick={toExport}>Export</button>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <table style={{ borderCollapse: "collapse", width: "80%" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid black" }}>
              <th style={{ padding: "10px" }}>Fecha</th>
              <th style={{ padding: "10px" }}>Nombre</th>
              <th style={{ padding: "10px" }}>Teléfono</th>
              <th style={{ padding: "10px" }}>Documento</th>
              <th style={{ padding: "10px" }}>Edad</th>
              <th style={{ padding: "10px" }}>Género</th>
              <th style={{ padding: "10px" }}>Asistencia</th>
              <th style={{ padding: "10px" }}>Tipo de nota personal</th>
              <th style={{ padding: "10px" }}>Nota personal</th>
              <th style={{ padding: "10px" }}>Valoración</th>
              <th style={{ padding: "10px" }}>Emoji</th>
              <th style={{ padding: "10px" }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {paginatedrecords.map((e, index) => (
              <tr key={index} style={{ borderBottom: "1px solid black" }}>
                <td style={{ padding: "10px" }}>{getTime(e.timestamp)}</td>
                <td style={{ padding: "10px" }}>{e.name}</td>
                <td style={{ padding: "10px" }}>{e.phoneNumber}</td>
                <td style={{ padding: "10px" }}>{e.id}</td>
                <td style={{ padding: "10px" }}>{e.age}</td>
                <td style={{ padding: "10px" }}>{e.gender}</td>
                <td style={{ padding: "10px" }}>{e.assistanceType}</td>
                <td style={{ padding: "10px" }}>{e.personalNote}</td>
                <td style={{ padding: "10px" }}>{e.generalNote}</td>
                <td style={{ padding: "10px" }}>{e.selectedEmoji}</td>
                <td style={{ padding: "10px" }}>{e.emojiText}</td>
                <td style={{ padding: "10px" }}>
                  <a
                    onClick={() => {
                      setShow(true);
                      setSelected(e);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    Ver detalles
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <br/>
      <div style={{display:'flex', justifyContent:'center'}}>
        <div style={{width:"80%", display:"flex", justifyContent:"end"}} >
          <div>
            <button 
            disabled={page<=0}
            onClick={()=>{
              setPage(page-1 <= 0 ? 0 :page-1)
            }}>
              Prev
            </button>
            <button disabled={
              (page+1)*PAGESIZE >= records.length
            } onClick={()=>{
              setPage(page+1)
            }}>Next</button>
          </div>
        </div>
      </div>
      {show && (
        <div
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
      style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "10px",
        maxWidth: "80%",
        maxHeight: "80%",
        overflow: "auto",
      }}
    >
      <h1>{selected.name}</h1>
      <p>Teléfono: {selected.phoneNumber}</p>
      <p>Documento: {selected.id}</p>
      <br/>
      <button onClick={() => setShow(false)}>Cerrar</button>
    </div>
  </div>
  )}
</>
);
}