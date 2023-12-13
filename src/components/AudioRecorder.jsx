import React, { useState, useEffect, useRef } from "react";
import { storage } from "../firebase";
import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  uploadBytes,
} from "firebase/storage";
import { ReactComponent as MicrophoneIcon } from '../assets//svg/mic.svg';
import '../css/Screens.css';

function AudioRecorder({ onAudioRecorded }) {
  const [recording, setRecording] = useState(false);
  const [recordingMessage, setRecordingMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const mediaRecorder = useRef(null);
  const audioRef = useRef(null);
  const audioChunks = useRef([]);
  const [timeInterval, setTimeInterval] = useState("");
  const [intervalId, setintervalId] = useState("");
  const MAX_RECORDING_TIME = 60000; // 1 minuto en milisegundos

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        setErrorMessage("");
        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current.addEventListener("dataavailable", (event) => {
          audioChunks.current.push(event.data);
          mediaRecorder.current.stream.getTracks().forEach((t) => t.stop());
        });
        mediaRecorder.current.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks.current);
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioUrl(audioUrl);
          console.log(audioUrl);
          const storageRef = ref(storage, `${new Date().getTime()}.mp4`);
          uploadBytes(storageRef, audioBlob).then(async (snapshot) => {
            onAudioRecorded(await getDownloadURL(snapshot.ref));
          });
          setRecording(false);
          setRecordingMessage("");
          clearInterval(intervalId);
          mediaRecorder.current = null;
          audioChunks.current = [];
        });
        setRecordingMessage("Grabando...");
        setRecording(true);
        setTimeInterval(
          setTimeout(() => {
            stopRecording();
          }, MAX_RECORDING_TIME)
        );
        mediaRecorder.current.start();
      })
      .catch((e) => {
        if (
          ["Permiso negado", "El sistema negó el permiso"].includes(
            e.message
          )
        ) {
          setErrorMessage("Por favor otorgar permiso para utilizar el micrófono");
        }
      });
  };

const stopRecording = () => {
  if (mediaRecorder.current && recording) {
    mediaRecorder.current.stop();
  }
};

  const handleStartRecording = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!recording) {
      audioChunks.current = [];
      startRecording();
    } else {
      stopRecording();
    }
  };

  const handlePlayAudio = (e) => {
    e.preventDefault();
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const handleDeleteAudio = (e) => {
    e.preventDefault();
    setAudioUrl("");
  };

  const handleResetAudio = (e) => {
    e.preventDefault();
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl("");
  };

  return (
    <div>
      {/* <p>{errorMessage}</p>
      <div onClick={handleStartRecording}>
      <MicrophoneIcon style={{ fill: recording ? '#ff8c00' : 'currentColor' }} /> */}
        {recording && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              borderRadius: "50%",
              width: "100px",
              height: "100px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: "999",
              }}
              >
              <span onClick={stopRecording} className="titilar" style={{
                fontSize:"1.2rem",
                zIndex:"999"
              }}>Grabando... ⏹</span>
              </div>
              )}
              {!audioUrl && (
              <div >
                Deja tu mensaje 👉
              <MicrophoneIcon onClick={handleStartRecording}
              style={{ fill: recording ? "#ff8c00" : "currentColor" }}
              />
              </div>
              )}
              {audioUrl && (
              <div className="recorded-audio">
                <audio ref={audioRef} src={audioUrl} controls />
                <button onClick={handleDeleteAudio}>Borrar</button>
              </div>
              )}
    </div>
  );
}
              
export default AudioRecorder;

// import React, { useState, useEffect, useRef } from "react";
// import { storage } from "../firebase";
// import {
//   ref,
//   getDownloadURL,
//   uploadBytesResumable,
//   uploadBytes,
// } from "firebase/storage";

// function AudioRecorder({ onAudioRecorded }) {
//   const [recording, setRecording] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [audioUrl, setAudioUrl] = useState("");
//   const mediaRecorder = useRef(null);
//   const audioRef = useRef(null);
//   const audioChunks = useRef([]);

//   const startRecording = () => {
//     navigator.mediaDevices
//       .getUserMedia({ audio: true })
//       .then((stream) => {
//         setErrorMessage("");
//         mediaRecorder.current = new MediaRecorder(stream);
//         mediaRecorder.current.addEventListener("dataavailable", (event) => {
//           audioChunks.current.push(event.data);
//           mediaRecorder.current.stream.getTracks().forEach((t) => t.stop());
//         });
//         mediaRecorder.current.addEventListener("stop", () => {
//           const audioBlob = new Blob(audioChunks.current);
//           const audioUrl = URL.createObjectURL(audioBlob);
//           setAudioUrl(audioUrl);
//           console.log(audioUrl);
//           const storageRef = ref(storage, `${new Date().getTime()}.mp4`);
//           uploadBytes(storageRef, audioBlob).then(async (snapshot) => {
//             onAudioRecorded(await getDownloadURL(snapshot.ref));
//           });
//         });
//         mediaRecorder.current.start();
//         setRecording(true);
//       })
//       .catch((e) => {
//         if (
//           ["Permission denied", "Permission denied by system"].includes(
//             e.message
//           )
//         ) {
//           setErrorMessage("Please grant permission of microphone");
//         }
//       });
//   };

//   const stopRecording = () => {
//     if (mediaRecorder.current && recording) {
//       mediaRecorder.current.stop();
//       setRecording(false);
//     }
//   };

//   const handleStartRecording = (e) => {
//     e.preventDefault();
//     if (!recording) {
//       audioChunks.current = [];
//       startRecording();
//     } else {
//       stopRecording();
//     }
//   };

//   const handlePlayAudio = (e) => {
//     e.preventDefault();
//     if (audioRef.current) {
//       audioRef.current.play();
//     }
//   };

//   const handleDeleteAudio = (e) => {
//     e.preventDefault();
//     setAudioUrl("");
//   };

//   const handleResetAudio = (e) => {
//     e.preventDefault();
//     if (audioUrl) {
//       URL.revokeObjectURL(audioUrl);
//     }
//     setAudioUrl("");
//   };

//   return (
//     <div>
//       <p>{errorMessage}</p>
//       <button onClick={handleStartRecording}>
//         {recording ? "Detener Grabación" : "Iniciar Grabación"}
//       </button>
//       {audioUrl && (
//         <div>
//           <audio ref={audioRef} src={audioUrl} controls />
//           <button onClick={handleDeleteAudio}>Borrar</button>
//           <button onClick={handleResetAudio}>Grabar de nuevo</button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default AudioRecorder;