import { useState, useRef, useEffect } from "react";
import styles from "./GenerarReporte.module.css";
import Label from "../../componentes/Label/Label";
import Input from "../../componentes/Input/Input";
import SelectList from "../../componentes/Lista_Opciones/ListaOpciones";
import poto from "./capturaFoto.jpeg";
import { createReporte } from "../../services/api"; // Asegúrate de que esta importación sea correcta
import { useNavigate } from "react-router-dom"; // Asegúrate de importar useNavigate

const GenerarReporte = () => {
  const [estado, setEstado] = useState("");
  const [placa, setPlaca] = useState("");
  const [cui, setCui] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [tempPhoto, setTempPhoto] = useState(null);
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const navigate = useNavigate(); // Inicializa el hook useNavigate

  useEffect(() => {
    if (showModal && videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          mediaStreamRef.current = stream;
          videoRef.current.srcObject = stream;
          console.log("Cámara iniciada.");
        })
        .catch((err) => console.error("Error al acceder a la cámara:", err));
    }

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        console.log("Cámara apagada.");
      }
    };
  }, [showModal]);

  const handleCapture = () => {
    console.log("Mostrar modal para captura de foto.");
    setShowModal(true);
  };

  const handlePhotoCapture = () => {
    const track = mediaStreamRef.current.getVideoTracks()[0];
    const imageCapture = new ImageCapture(track);

    imageCapture
      .takePhoto()
      .then((blob) => {
        const photoURL = URL.createObjectURL(blob);
        setTempPhoto(photoURL);
        setPhotoTaken(true);
        console.log("Foto capturada exitosamente.");

        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        console.log("Cámara apagada.");
      })
      .catch((error) => console.error("Error al capturar la imagen:", error));
  };

  const handleTryAgain = () => {
    console.log("Intentar capturar la foto nuevamente.");
    setPhotoTaken(false);
    setTempPhoto(null);
    if (videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          mediaStreamRef.current = stream;
          videoRef.current.srcObject = stream;
        })
        .catch((err) => console.error("Error al acceder a la cámara:", err));
    }
  };

  const handleDelete = () => {
    console.log("Eliminar foto y cerrar modal.");
    setTempPhoto(null);
    setPhotoTaken(false);
    setShowModal(false);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      console.log("Cámara apagada al cerrar el modal.");
    }
  };

  const handleSend = () => {
    if (!tempPhoto) {
      alert("No se ha capturado ninguna foto. Por favor, capture una foto.");
      return;
    }
    setCapturedPhoto(tempPhoto);
    setShowModal(false);
    console.log("Foto lista para ser enviada.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!capturedPhoto) {
      alert(
        "No se ha capturado una foto. Por favor, capture una antes de enviar."
      );
      return;
    }

    const response = await fetch(capturedPhoto);
    const blob = await response.blob();

    const formData = new FormData();
    formData.append("placa", placa);
    formData.append("cui", cui);
    formData.append("estado", estado);
    formData.append("photo", blob, "captura.jpg");

    try {
      const response = await createReporte(formData);
      console.log("Reporte agregado:", response);
      console.log("Datoa", formData);
      alert("Reporte creado con éxito");
      // Navegar a otra página o resetear el formulario
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
          <div style={{ position: "relative" }}>
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
        <div className={styles.modal}>
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
