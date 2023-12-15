import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, fetchContactsData, logout } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { query, collection, getDocs, where } from "firebase/firestore";
import '../css/Report.css';
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import Logo from '../assets/logo_textoblanco_fondotransp.png';

const iconStyle = {
  cursor: "pointer",
};

const headerStyle = {
  padding: "10px",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
};


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
  const [dniFrente, setDniFrente] = useState(null);
  const [dniDorso, setDniDorso] = useState(null);
  const [retratoDni, setRetratoDni] = useState(null);
  const PAGESIZE = 10
  // const [user, loading] = useAuthState(auth);

  if (!loading && user) {
    console.log(user.uid);

    const fetchDataFromFirestore = async (uid) => {
      try {
        const clientesCollection = collection(db, 'clientes');
        const querySnapshot = await getDocs(
          query(clientesCollection, where('cuil', '==', uid))
        );

        const data = [];
        querySnapshot.forEach((doc) => {
          const {
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
            retratoDni,
          } = doc.data();

          setStartDate(fechaSolicitud)
          setEndDate(fechaNacimiento)
          setNombre(nombre)
          setCuil(cuil)
          setApellido(apellido)
          setTelefono(telefono)
          setMail(mail)
          setEstadoCivil(estadoCivil)
          setHijos(hijos)
          setOcupacion(ocupacion)
          setIngresoMensual(ingresoMensual)
          setAntiguedad(antiguedad)
          setDniDorso(dniDorso)
          setDniFrente(dniFrente)
          setRetratoDni(retratoDni)

        });
      } catch (error) {
        console.error('Error fetching data from Firestore:', error);
      }
    };
    fetchDataFromFirestore(user.uid);
  }

  useEffect(() => {
    console.log(page)
    const min = page * PAGESIZE
    const max = (page * PAGESIZE) + PAGESIZE
    let _ = records.slice(min, max)
    setpaginatedrecords(_)
  }, [page])

  const checkAuth = async () => {
    if (!user) return navigate("/login");
    if (user) return navigate("/report");

    const uid = user && user.uid;
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const doc = await getDocs(q);
    const data = [];
    doc.forEach((doc) => {
      data.push(doc.data());
    });
    let rows = await fetchContactsData()
    setRecords(rows);
    setpaginatedrecords(rows.slice(0, PAGESIZE))
  };

  const getTime = (fechaSolicitud) => {
    const fireBaseTime = new Date(
      fechaSolicitud.seconds * 1000 + fechaSolicitud.nanoseconds / 1000000,
    );
    const date = fireBaseTime.toDateString() + " " + fireBaseTime.toLocaleTimeString()
    return date;
  }

  const getDay = (fechaSolicitud) => {
    const fireBaseTime = new Date(
      fechaSolicitud.seconds * 1000 + fechaSolicitud.nanoseconds / 1000000
    );
    const date = fireBaseTime.toDateString();
    return date;
  };

  const toExport = () => {
    let header = [
      "nombre",
      "apellido",
      "cuil",
      "telefono",
      "mail",
      "estadoCivil",
      "hijos",
      "ocupacion",
      "ingresoMensual",
      "antiguedad",
      "fechaNacimiento",
      "fechaSolicitud",
      "dniFrente",
      "dniDorso",
      "retratoDni",
      "\n"
    ]
    let csvRows = records.map(e => {
      let _ = []
      _[0] = e.nombre
      _[1] = e.apellido
      _[2] = e.cuil
      _[3] = e.telefono
      _[4] = e.mail
      _[5] = `"${e.estadoCivil}"`
      _[6] = e.hijos ? e.hijos : ""
      _[7] = `"${e.ocupacion}"`
      _[8] = e.ingresoMensual
      _[9] = `"${e.antiguedad}"`
      _[10] = `"${e.fechaNacimiento}"`
      _[11] = getTime(e.timestamp)
      _[12] = e.dniFrente
      _[13] = e.dniDorso
      _[14] = e.retratoDni
      _[15] = "\n"
      return _
    })
    var pom = document.createElement('a');
    var blob = new Blob([header, ...csvRows], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    pom.href = url;
    pom.setAttribute('download', 'download.csv');
    pom.click();
    alert("Archivo exportado correctamente")
  }

  useEffect(() => {
    const min = page * PAGESIZE;
    const max = page * PAGESIZE + PAGESIZE;
    let _ = records.slice(min, max);
    setpaginatedrecords(_);
  }, [page]);

  useEffect(() => {
    checkAuth();
  }, []);
  //TEST THIS INSTEAD

  // useEffect(() => {
  //   if (loading) return;
  //   checkAuth();
  //   // enter()
  // }, [user, loading]);

  const filterData = async () => {
    let rows = await fetchContactsData(startDate, endDate)
    setRecords(rows);
    setpaginatedrecords(rows)
  }

  const handleSortAscend = (key) => {
    //sort on basis of key
    let _;
    if (key === "id") {
      _ = [...paginatedrecords].sort((a, b) => a[key] - b[key]);
    } else if (key === "timestamp") {
      _ = [...paginatedrecords].sort(
        (a, b) => new Date(getTime(a[key])) - new Date(getTime(b[key]))
      );
    } else {
      _ = [...paginatedrecords].sort((a, b) => (a[key] > b[key] ? 1 : -1));
    }


    setpaginatedrecords(_);
  };
  const handleSortDescend = (key) => {
    let _;
    if (key === "id") {
      _ = [...paginatedrecords].sort((a, b) => b[key] - a[key]);
    } else if (key === "timestamp") {
      _ = [...paginatedrecords].sort(
        (a, b) => new Date(getTime(b[key])) - new Date(getTime(a[key]))
      );
    } else {
      _ = [...paginatedrecords].sort((a, b) => (a[key] > b[key] ? -1 : 1));
    }
    setpaginatedrecords(_);
  };

  return (
    <div className="admin-background">
      <nav className="nav__container">
        <div className="innderNav">
          <div className="admin__title__card">
            <img className="admin__logo" src={Logo} />
            <h2 className="admin__title">Herramienta de Reportes</h2>
          </div>
          <div className="admin__button__container">
            <button className="btn__admin">
              <Link className="btn__admin__text" to="/login">
                Volver a login
              </Link>
            </button>
            <button className="btn__admin">
              <a className="btn__admin__text" onClick={logout} href="/login">
                Salir
              </a>
            </button>
          </div>
        </div>
      </nav>

      <div style={{
        display: 'flex',
        justifyContent: 'center'
      }}>
        <div style={{
          width: "80%",
          display: "flex",
          justifyContent: "space-between"
        }} >
          <div>
            <span>
              Fecha inicial: <input type={"date"} value={startDate} onChange={e => setStartDate(e.target.value)} />
              Fecha Final: <input type={"date"} value={endDate} onChange={e => setEndDate(e.target.value)} />
              <button onClick={filterData}>filter</button>
            </span>
          </div>

          <div>
            <button disabled={records.length === 0} onClick={toExport}>Exportar CSV</button>
          </div>
        </div>
      </div>
      <div style={{
        display: "flex",
        justifyContent: "center"
      }}>
        <table style={{
          borderCollapse: "collapse",
          width: "80%"
        }}>
          <thead>
            <tr style={{
              borderBottom: "1px solid black"
            }}>
              <th style={{ padding: "10px" }}>Id</th>
              <th>
                <div style={headerStyle}>
                  <div>
                    <TiArrowSortedUp
                      onClick={() => handleSortAscend("timestamp")}
                      style={iconStyle}
                    />
                    <TiArrowSortedDown
                      onClick={() => handleSortDescend("timestamp")}
                      style={iconStyle}
                    />
                  </div>
                  Fecha
                </div>
              </th>
              <th>
                <div style={headerStyle}>
                  <div>
                    <TiArrowSortedUp
                      onClick={() => handleSortAscend("nombre")}
                      style={iconStyle}
                    />
                    <TiArrowSortedDown
                      onClick={() => handleSortDescend("nombre")}
                      style={iconStyle}
                    />
                  </div>
                  Nombre
                </div>
              </th>
              <th>
                <div style={headerStyle}>
                  <div>
                    <TiArrowSortedUp
                      onClick={() => handleSortAscend("Apellido")}
                      style={iconStyle}
                    />
                    <TiArrowSortedDown
                      onClick={() => handleSortDescend("Apellido")}
                      style={iconStyle}
                    />
                  </div>
                  Apellido
                </div>
              </th>
              <th>
                <div style={headerStyle}>
                  <div>
                    <TiArrowSortedUp
                      onClick={() => handleSortAscend("cuil")}
                      style={iconStyle}
                    />
                    <TiArrowSortedDown
                      onClick={() => handleSortDescend("cuil")}
                      style={iconStyle}
                    />
                  </div>
                  CUIL
                </div>
              </th>
              <th style={{ padding: "10px" }}>Teléfono</th>
              <th>
                <div style={headerStyle}>
                  <div>
                    <TiArrowSortedUp
                      onClick={() => handleSortAscend("mail")}
                      style={iconStyle}
                    />
                    <TiArrowSortedDown
                      onClick={() => handleSortDescend("mail")}
                      style={iconStyle}
                    />
                  </div>
                  Email
                </div>
              </th>
              <th>
                <div style={headerStyle}>
                  <div>
                    <TiArrowSortedUp
                      onClick={() => handleSortAscend("ingresoMensual")}
                      style={iconStyle}
                    />
                    <TiArrowSortedDown
                      onClick={() => handleSortDescend("ingresoMensual")}
                      style={iconStyle}
                    />
                  </div>
                  Ingreso Mensual
                </div>
              </th>
              <th style={{ padding: "10px" }}>Antiguedad</th>
              <th>
                <div style={headerStyle}>
                  <div>
                    <TiArrowSortedUp
                      onClick={() => handleSortAscend("estadoCivil")}
                      style={iconStyle}
                    />
                    <TiArrowSortedDown
                      onClick={() => handleSortDescend("estadoCivil")}
                      style={iconStyle}
                    />
                  </div>
                  Estado Civil
                </div>
              </th>
              <th style={{ padding: "10px" }}>Ocupación</th>
              <th style={{ padding: "10px" }}>Hijos</th>
              <th style={{ padding: "10px" }}>Fecha de Nacimiento</th>
              <th style={{ padding: "10px" }}>Fecha de Solicitud</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid black" }}>
              <td style={{ padding: "10px" }}>{nombre}</td>
              <td style={{ padding: "10px" }}>{apellido}</td>
              <td style={{ padding: "10px" }}>{cuil}</td>
              <td style={{ padding: "10px" }}>{telefono}</td>
              <td style={{ padding: "10px" }}>{mail}</td>
              <td style={{ padding: "10px" }}>{ingresoMensual}</td>
              <td style={{ padding: "10px" }}>{antiguedad}</td>
              <td style={{ padding: "10px" }}>{estadoCivil}</td>
              <td style={{ padding: "10px" }}>{ocupacion}</td>
              <td style={{ padding: "10px" }}>{hijos}</td>
              <td style={{ padding: "10px" }}>{endDate}</td>
              <td style={{ padding: "10px" }}>{startDate}</td>
              <td style={{ padding: "10px" }}>{dniFrente}</td>
              <td style={{ padding: "10px" }}>{dniDorso}</td>
              <td style={{ padding: "10px" }}>{retratoDni}</td>
              <td style={{ padding: "10px" }}>
                <a
                  onClick={() => {
                    setShow(true);
                    // setSelected(e);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  Ver documentación
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <br />
      <div style={{
        display: 'flex',
        justifyContent: 'center'
      }}>
        <div style={{
          width: "80%",
          display: "flex",
          justifyContent: "end"
        }} >
          <div>
            <button
              disabled={page <= 0}
              onClick={() => {
                setPage(page - 1 <= 0 ? 0 : page - 1)
              }}>
              Ant
            </button>
            <button disabled={
              (page + 1) * PAGESIZE >= records.length
            } onClick={() => {
              setPage(page + 1)
            }}>Prev</button>
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
            <h1>{selected.nombre}</h1>
            <p>Teléfono: {selected.telefono}</p>
            <p>CUIL: {selected.cuil}</p>
            <a href={`mailto:${selected.correo}`}>Correo electrónico</a><br />
            <p>DNI Frente</p>
            <img src={`data:image/png;base64, ${selected.dniFrente}`} alt="DNI" />
            <p>DNI Dorso</p>
            <img src={`data:image/png;base64, ${selected.dniDorso}`} alt="DNI" />
            <p>Retrato con DNI</p>
            <img src={`data:image/jpeg;base64, ${selected.retratoDni}`} alt="Retrato+DNI" />
            <button onClick={() => setShow(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}