import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, fetchContactsData, logout } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { query, collection, getDocs, where, addDoc } from "firebase/firestore";
import { QuerySnapshot } from "firebase/firestore";
import '../css/Report.css';
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { InfinitySpin } from "react-loader-spinner";
import UserRegisteredBar from "../components/UserRegisteredBar";
import SubmitApexChart from "../components/SubmitApexChart";

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
  const [ageGroup, setAgeGroup] = useState(null);
  const [loader, setLoader] = useState(true);
  const [registerPerDay, setRegisterPerDay] = useState([]);
  const [Genders, setGenders] = useState([
    { name:'Masculino', value:0},
    { name:'Femenino', value:0},
    { name:'Otro', value:0},
    { name:'No especificado', value:0},
  ]);
  const [AgeChartData, setAgeChartData] = useState([
 {
    name: "Edad 1-15",
    uv: 0,
    pv: 800,
    amt: 1400,
  },
  {
    name: "Edad 16-30",
    uv: 0,
    pv: 967,
    amt: 1506,
  },
  {
    name: "Edad 31-60",
    uv: 0,
    pv: 1098,
    amt: 989,
  },
  {
    name: "Edad 60+",
    uv: 0,
    pv: 1200,
    amt: 1228,
  },
]);

  const PAGESIZE =10

  useEffect(()=>{
    console.log(page)
    const min = page * PAGESIZE
    const max = (page * PAGESIZE) + PAGESIZE
    let _ =records.slice( min, max)
    setpaginatedrecords(_)
  }, [page])

  const filterGender = (fetchedData) => {
    fetchedData.forEach(item => {
 switch (item.gender) {
   case 'masculino':
     setGenders((prevState) => {
       const updatedGenders = prevState.map((gender) => {
         if (gender.name === "Masculino") {
           return { ...gender, value: gender.value + 1 };
         } else {
           return gender;
         }
       });
       return updatedGenders;
     });

     break;
   case 'femenino':
     
      setGenders((prevState) => {
        const updatedGenders = prevState.map((gender) => {
          if (gender.name === "Femenino") {
            return { ...gender, value: gender.value + 1 };
          } else {
            return gender;
          }
        });
        return updatedGenders;
      });

     break;
   case 'otro':
     setGenders((prevState) => {
       const updatedGenders = prevState.map((gender) => {
         if (gender.name === "Otro") {
           return { ...gender, value: gender.value + 1 };
         } else {
           return gender;
         }
       });
       return updatedGenders;
     });

     break;
   default:
      setGenders((prevState) => {
        const updatedGenders = prevState.map((gender) => {
          if (gender.name === "No especificado") {
            return { ...gender, value: gender.value + 1 };
          } else {
            return gender;
          }
        });
        return updatedGenders;
      });

     break;
   
 }
});
setLoader(false)
 }

const groupAge = (fetchedData) => {
let ageinInt = []
fetchedData.forEach(item => {
 ageinInt.push(parseInt(item.age))
})
ageinInt.forEach((item) => {
 
 if(item >= 1 && item <= 15){
   setAgeChartData((prevState) => {
     const updatedAgeChartData = prevState.map((age) => {
       if (age.name === "Edad 1-15") {
           return { ...age, uv: age.uv + 1 };
       } else {
         return age;
       }
     });
     return updatedAgeChartData;
   });
 }
 else
 if(item >= 16 && item <= 30){
   setAgeChartData((prevState) => {
     const updatedAgeChartData = prevState.map((age) => {
       if (age.name === "Edad 16-30") {
           return { ...age, uv: age.uv + 1 };
       } else {
         return age;
       }
     });
     return updatedAgeChartData;
   });
 }
 else if(item >= 31 && item <= 60){
   setAgeChartData((prevState) => {
     const updatedAgeChartData = prevState.map((age) => {
       if (age.name === "Edad 31-60") {
           return { ...age, uv: age.uv + 1 };
       } else {
         return age;
       }
     });
     return updatedAgeChartData;
   });
 }
 else 
 {
   setAgeChartData((prevState) => {
     const updatedAgeChartData = prevState.map((age) => {
       if (age.name === "Edad 60+") {
           return { ...age, uv: age.uv + 1 };
       } else {
         return age;
       }
     });
     return updatedAgeChartData;
   });
 }
})

}

  const checkAuth = async () => {
    if (!user) return navigate("/login");
    if (user.role === "user") return navigate("/dashboard");
    if (user.role === "report") return navigate("/report");

    const uid = user && user.uid;
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const doc = await getDocs(q);
     const data = [];
     doc.forEach((doc) => {
       data.push(doc.data());
     });
    if (!data.role === "admin" || !data.role === "report") return navigate("/login");
    let rows = await fetchContactsData()
    setRecords(rows);
    filterRegisteredUsers(rows);
    filterGender(rows)
    groupAge(rows)
    setpaginatedrecords(rows.slice(0,PAGESIZE))
  };

  const getTime = (time) => {
    const fireBaseTime = new Date(
      time.seconds * 1000 + time.nanoseconds / 1000000,
    );
    const date = fireBaseTime.toDateString()+" " +fireBaseTime.toLocaleTimeString()
    return date;
  }
  
const getDay = (time) => {
  const fireBaseTime = new Date(
    time.seconds * 1000 + time.nanoseconds / 1000000
  );
  const date = fireBaseTime.toDateString();
  return date;
};

  const toExport = () => {
    let header = [
      "name",
      "age",
      "id",
      "assistanceReceived",
      "assistanceType",
      "feedback",
      "gender",
      "generalNote",
      "personalNote",
      "phoneNumber",
      "privacy",
      "time",
      "voiceNoteUrl",
      "\n"
    ]
    let csvRows = records.map(e=>{
      let _ = []
      _[0] = e.name
      _[1] = e.age
      _[2] = e.id
      _[3] = `"${e.assistanceReceived}"`
      _[4] = `"${e.assistanceType}"`
      _[5] = `"${e.feedback}"`
      _[6] = e.gender
      _[7] = `"${e.generalNote}"`
      _[8] = `"${e.personalNote}"` 
      _[9] = e.phoneNumber
      _[10] = e.privacy
      _[11] = getTime(e.timestamp)
      _[12] = e.voiceNoteUrl
      _[13]="\n"
      return _
  })  
      var pom = document.createElement('a');
      var blob = new Blob([header, ...csvRows],{type: 'text/csv;charset=utf-8;'});
      var url = URL.createObjectURL(blob);
      pom.href = url;
      pom.setAttribute('download', 'download.csv');
      pom.click();
      alert("Archivo exportado correctamente")
  }

// create a function to handle number of registered users per day
const filterRegisteredUsers = (data) => {
  let days = [];
  let count = 0;
  data.map((item) => {
    days.push(getDay(item.timestamp));
  });
  let uniqueDays = [...new Set(days)];
  uniqueDays.map((item) => {
    count = 0;
    days.map((day) => {
      if (item === day) {
        count++;
      }
    });
    if (!registerPerDay.some((e) => e.day === item)) {
      registerPerDay.push({ day: item, count: count });
    } else {
      registerPerDay.map((e) => {
        if (e.day === item) {
          e.count = count;
        }
      });
    }
  
  });

};


useEffect(() => {
    const min = page * PAGESIZE;
    const max = page * PAGESIZE + PAGESIZE;
    let _ = records.slice(min, max);
    setpaginatedrecords(_);
  }, [page]);

useEffect(() => {
  switch (ageGroup) {
    case "1":
      let _;
      fetchContactsData().then((res) => {
        _ = [...res.slice(0, PAGESIZE)].filter((e) => {
          if (e.age >= 1 && e.age <= 15) {
            return e;
          }
        });
        setpaginatedrecords(_);
      });

      break;
    case "2":
      fetchContactsData().then((res) => {
        _ = [...res.slice(0, PAGESIZE)].filter((e) => {
          if (e.age >= 16 && e.age <= 30) {
            return e;
          }
        });
        setpaginatedrecords(_);
      });

      break;
    case "3":
      fetchContactsData().then((res) => {
        _ = [...res.slice(0, PAGESIZE)].filter((e) => {
          if (e.age >= 31 && e.age <= 60) {
            return e;
          }
        });
        setpaginatedrecords(_);
      });

      break;
    case "4":
      fetchContactsData().then((res) => {
        _ = [...res.slice(0, PAGESIZE)].filter((e) => {
          if (e.age > 60) {
            return e;
          }
        });
        setpaginatedrecords(_);
      });
      break;
    default:
      fetchContactsData().then((res) => {
        setRecords(res);
        setpaginatedrecords(res.slice(0, PAGESIZE));
      });

      break;
  }
}, [ageGroup]);

  useEffect(() => {
    checkAuth();
  }, []);
  //TEST THIS INSTEAD

  // useEffect(() => {
  //   if (loading) return;
  //   checkAuth();
  //   // enter()
  // }, [user, loading]);

  const filterData = async() => {
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
          <div className="admin-title-card">
          <h1 className="admin-title"> MicroCuotas</h1>
          <br/>
          <h2 className="admin-title">Herramienta de Reportes</h2>
          </div>
        <button className="btn-admin">
          <Link className="btn-admin-text" to="/dashboard">
                <h3>
                INICIAR FORMULARIO
                </h3>
            </Link>
          </button>
          <button className="btn-admin">
            <a className="btn-admin-text" onClick={logout} href="/login">
                SALIR
            </a>
          </button>
        </div>
      </nav>
      
      {loader && (
        <div className="_loader">
          <InfinitySpin width="200" color="#4fa94d" />
        </div>
      )}
      {!loader && (
        <div className="container__chart" >
          {/* <UserRegisteredBar registerPerDay={registerPerDay} /> */}
          <SubmitApexChart registerPerDay={registerPerDay} />


        
        </div>
      )}
      <br />
      <div style={{
        display:'flex', 
        justifyContent:'center'
        }}>
        <div style={{
          width:"80%", 
        display:"flex", 
        justifyContent:"space-between"
        }} >
          <div>
            <span>
              Fecha inicial: <input type={"date"} value={startDate} onChange={e=>setStartDate(e.target.value)} /> 
              Fecha Final: <input type={"date"} value={endDate} onChange={e=>setEndDate(e.target.value)} />
              <button onClick={filterData}>filter</button>
            </span>
          </div>
          <div>
            <span>Ordenar por edad</span>{" "}
            <select onChange={(e) => setAgeGroup(e.target.value)}>
              <option value="all">All</option>
              <option value="1">1-15</option>
              <option value="2">16-30</option>
              <option value="3">31-60</option>
              <option value="4">Mayor de 60</option>
            </select>
          </div>
          <div>
            <button disabled={records.length===0} onClick={toExport}>Exportar CSV</button>
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
                      onClick={() => handleSortAscend("name")}
                      style={iconStyle}
                    />
                    <TiArrowSortedDown
                      onClick={() => handleSortDescend("name")}
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
                      onClick={() => handleSortAscend("phoneNumber")}
                      style={iconStyle}
                    />
                    <TiArrowSortedDown
                      onClick={() => handleSortDescend("phoneNumber")}
                      style={iconStyle}
                    />
                  </div>
                  Teléfono
                </div>
              </th>
              <th>
                <div style={headerStyle}>
                  <div>
                    <TiArrowSortedUp
                      onClick={() => handleSortAscend("id")}
                      style={iconStyle}
                    />
                    <TiArrowSortedDown
                      onClick={() => handleSortDescend("id")}
                      style={iconStyle}
                    />
                  </div>
                  Documento
                </div>
              </th>
              <th>
                <div style={headerStyle}>
                  <div>
                    <TiArrowSortedUp
                      onClick={() => handleSortAscend("age")}
                      style={iconStyle}
                    />
                    <TiArrowSortedDown
                      onClick={() => handleSortDescend("age")}
                      style={iconStyle}
                    />
                  </div>
                  Edad
                </div>
              </th>
              <th>
                <div style={headerStyle}>
                  <div>
                    <TiArrowSortedUp
                      onClick={() => handleSortAscend("gender")}
                      style={iconStyle}
                    />
                    <TiArrowSortedDown
                      onClick={() => handleSortDescend("gender")}
                      style={iconStyle}
                    />
                  </div>
                  Género
                </div>
              </th>
              <th style={{ padding: "10px" }}>Asistencia</th>
              <th>
                <div style={headerStyle}>
                  <div>
                    <TiArrowSortedUp
                      onClick={() => handleSortAscend("personalNote")}
                      style={iconStyle}
                    />
                    <TiArrowSortedDown
                      onClick={() => handleSortDescend("personalNote")}
                      style={iconStyle}
                    />
                  </div>
                  Tipo de nota personal
                </div>
              </th>
              <th style={{ padding: "10px" }}>Nota personal</th>
              <th style={{ padding: "10px" }}>
                <div style={headerStyle}>
                  <div>
                    <TiArrowSortedUp
                      onClick={() => handleSortAscend("selectedEmoji")}
                      style={iconStyle}
                    />
                    <TiArrowSortedDown
                      onClick={() => handleSortDescend("selectedEmoji")}
                      style={iconStyle}
                    />
                  </div>
                  Valoración
                </div>
              </th>
              <th style={{ padding: "10px" }}>Emoji</th>
              <th style={{ padding: "10px" }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {paginatedrecords.map((e, index) => (
              <tr key={index} style={{ borderBottom: "1px solid black" }}>
                <td style={{ padding: "10px" }}>{index + 1}</td>
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
      <br />
      <div style={{
        display:'flex', 
        justifyContent:'center'
        }}>
        <div style={{
          width:"80%", 
          display:"flex", 
          justifyContent:"end"}} >
          <div>
            <button 
            disabled={page<=0}
            onClick={()=>{
              setPage(page-1 <= 0 ? 0 :page-1)
            }}>
              Ant
            </button>
            <button disabled={
              (page+1)*PAGESIZE >= records.length
            } onClick={()=>{
              setPage(page+1)
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
      <h1>{selected.name}</h1>
      <p>Teléfono: {selected.phoneNumber}</p>
      <p>Documento: {selected.id}</p>
      <br/>
      <button onClick={() => setShow(false)}>Cerrar</button>
    </div>
  </div>
  )}
</div>
);
}