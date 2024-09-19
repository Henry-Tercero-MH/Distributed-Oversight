import { useState, useRef, useEffect } from "react";
import styles from "./GenerarReporte.module.css";
import Label from "../../componentes/Label/Label";
import Input from "../../componentes/Input/Input";
import SelectList from "../../componentes/Lista_Opciones/ListaOpciones";
import poto from "./capturaFoto.jpeg";

const GenerarReporte = () => {
  const [estado, setEstado] = useState("");
  const [placa, setPlaca] = useState("");
  const [cui, setCui] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [tempPhoto, setTempPhoto] = useState(null);
  const videoRef = useRef(null);
  const captureAreaRef = useRef(null);
  const modalRef = useRef(null);
  let mediaStream = null; // Para almacenar el stream de video

  // Efecto para manejar la cámara cuando se muestra el modal
  useEffect(() => {
    if (showModal && videoRef.current) {
      // Iniciar la cámara cuando se muestra el modal
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          mediaStream = stream;
          videoRef.current.srcObject = stream;
          console.log("Cámara iniciada.");
        })
        .catch((err) => console.error("Error al acceder a la cámara:", err));
    }

    return () => {
      // Apagar la cámara al cerrar el modal
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
        console.log("Cámara apagada.");
      }
    };
  }, [showModal]);

  // Mostrar el modal y abrir la cámara
  const handleCapture = () => {
    console.log("Mostrar modal para captura de foto.");
    setShowModal(true);
  };

  // Función para capturar la imagen desde el video usando ImageCapture
  const handlePhotoCapture = () => {
    const track = mediaStream.getVideoTracks()[0]; // Obtener el track de video

    const imageCapture = new ImageCapture(track);

    imageCapture
      .takePhoto()
      .then((blob) => {
        const photoURL = URL.createObjectURL(blob); // Crear URL temporal de la imagen
        setTempPhoto(photoURL); // Guardar la URL de la imagen capturada
        setPhotoTaken(true); // Indicar que la foto ha sido tomada
        console.log("Foto capturada exitosamente.");

        // Apagar la cámara después de la captura
        mediaStream.getTracks().forEach((track) => track.stop());
        console.log("Cámara apagada.");
      })
      .catch((error) => console.error("Error al capturar la imagen:", error));
  };

  // Intentar capturar la foto nuevamente
  const handleTryAgain = () => {
    console.log("Intentar capturar la foto nuevamente.");
    setPhotoTaken(false);
    setTempPhoto(null);
    if (videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          mediaStream = stream;
          videoRef.current.srcObject = stream;
        })
        .catch((err) => console.error("Error al acceder a la cámara:", err));
    }
  };

  // Eliminar la foto y cerrar el modal
  const handleDelete = () => {
    console.log("Eliminar foto y cerrar modal.");
    setTempPhoto(null);
    setPhotoTaken(false);
    setShowModal(false);
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      console.log("Cámara apagada al cerrar el modal.");
    }
  };

  // Enviar la foto capturada
  const handleSend = () => {
    if (!tempPhoto) {
      alert("No se ha capturado ninguna foto. Por favor, capture una foto.");
      return;
    }
    setCapturedPhoto(tempPhoto);
    setShowModal(false);
    console.log("Foto lista para ser enviada.");
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!capturedPhoto) {
      alert(
        "No se ha capturado una foto. Por favor, capture una antes de enviar."
      );
      console.log("No se ha capturado una foto.");
      return;
    }

    const formData = new FormData();
    formData.append("placa", placa);
    formData.append("cui", cui);
    formData.append("estado", estado);
    formData.append("photo", capturedPhoto);

    try {
      const response = await fetch(`${API_URL}/reportes`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Datos enviados exitosamente.");
      } else {
        console.error("Error al enviar los datos:", response.statusText);
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    }
  };

  return (
    <section className={styles.cajaGenerarReporte}>
      <form
        onSubmit={handleSubmit}
        className={styles.cajaFormularioGenerarReporte}
      >
        <div className={styles.titulo}>
          <Label>Generar Reporte</Label>
        </div>
        <div className={styles.cajaIngresodatos}>
          <Label>Digite su placa</Label>
          <Input
            type="text"
            placeholder="Ingrese su placa..."
            value={placa}
            onChange={(e) => setPlaca(e.target.value)}
          />

          <Label>Valide su CUI</Label>
          <Input
            type="text"
            placeholder="Ingrese su CUI..."
            value={cui}
            onChange={(e) => setCui(e.target.value)}
          />

          <Label>Capture una foto</Label>
          <div ref={captureAreaRef} style={{ position: "relative" }}>
            {!capturedPhoto ? (
              <img
                src={poto}
                alt="Imagen predeterminada"
                width="330px"
                height="250px"
              />
            ) : (
              <img
                src={capturedPhoto}
                alt="Foto Capturada"
                width="330px"
                height="250px"
              />
            )}
            <button
              type="button"
              onClick={handleCapture}
              className={styles.captureButton}
            >
              Capturar
            </button>
          </div>

          <SelectList
            id="estado"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            options={["Solvente", "Reporte de Robo", "Insolvente"]}
            placeholder="Seleccione una categoría"
          />
        </div>
        <button type="submit">Reportar</button>
      </form>

      {/* Modal */}
      {showModal && (
        <div className={styles.modal} ref={modalRef}>
          <div className={styles.modalContent}>
            {!photoTaken ? (
              <div>
                <video ref={videoRef} width="330" height="250" autoPlay />
                <button onClick={handlePhotoCapture}>Capturar Foto</button>
              </div>
            ) : (
              <div>
                <img
                  src={tempPhoto}
                  alt="Foto Capturada"
                  width="330px"
                  height="250px"
                />
              </div>
            )}
            <div>
              <button onClick={handleSend}>Enviar</button>
              <button onClick={handleTryAgain}>Intentar de nuevo</button>
              <button onClick={handleDelete}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default GenerarReporte;
