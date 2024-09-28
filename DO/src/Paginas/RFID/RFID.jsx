import React, { useState, useEffect } from "react";
import styles from "./RFID.module.css";
import imagenVehiculo from "./vehiculo.png";
import Label from "../../componentes/Label/Label";
import MostrarTexto from "../../componentes/LabelTexto/MostrarTexto";
import imagenUsuario from "./perfilMan.png";
import iconCalendar from "./calendar.png";
import iconReloj from "./iconReloj.png";
import iconUbicacion from "./iconUbicacion.png";
import { getRFIDByPlate } from "./../../services/api"; // Asegúrate de que esta función esté bien implementada

const RFID = () => {
  const [vehiculoData, setVehiculoData] = useState({});
  const [conductorData, setConductorData] = useState({});
  const [reporteData, setReporteData] = useState({
    ubicacion: "",
    fecha: "",
    hora: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const fetchVehicleData = async (tagID) => {
    try {
      const data = await getRFIDByPlate(tagID);
      console.log("Datos recibidos del API:", data); // Asegúrate de que estás recibiendo datos válidos
      if (data) {
        setVehiculoData(data);
        setConductorData(data || {}); // Asegúrate de que 'conductor' sea una propiedad válida
        setErrorMessage("");

        // Captura la ubicación y la fecha/hora
        captureLocationAndTime();
      } else {
        setErrorMessage("No se encontraron datos para esta placa.");
      }
    } catch (error) {
      console.error("Error al buscar el vehículo:", error);
      setErrorMessage(
        `Error al acceder a los datos del vehículo: ${error.message}`
      );
    }
  };

  const captureLocationAndTime = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          const currentDate = new Date();
          const fecha = currentDate.toLocaleDateString();
          const hora = currentDate.toLocaleTimeString();

          setReporteData({
            ubicacion: `Lat: ${latitude}, Lon: ${longitude}`,
            fecha: fecha,
            hora: hora,
          });

          console.log("Datos después de la lectura:", {
            ubicacion: `Lat: ${latitude}, Lon: ${longitude}`,
            fecha: fecha,
            hora: hora,
          });
        },
        (error) => {
          console.error("Error al obtener la ubicación:", error);
          setErrorMessage("Error al capturar la ubicación.");
        }
      );
    } else {
      setErrorMessage(
        "La geolocalización no está soportada en este navegador."
      );
    }
  };

  const handleRFIDInput = (event) => {
    const tagID = event.target.value.trim(); // Captura el ID del RFID y elimina espacios
    console.log("ID RFID ingresado:", tagID); // Log de depuración

    // Verifica si la tecla presionada es "Enter"
    if (event.key === "Enter") {
      if (tagID.length === 8) {
        // Verifica si el ID tiene la longitud correcta
        fetchVehicleData(tagID); // Llama a la función de búsqueda con el ID
        event.target.value = ""; // Resetea el input para la siguiente lectura
      } else {
        setErrorMessage("El ID RFID debe tener 8 caracteres."); // Mensaje de error si la longitud es incorrecta
      }
      event.preventDefault(); // Previene el refresco de la página
    }
  };

  // Efecto para enfocar el input oculto al montar el componente
  useEffect(() => {
    const input = document.getElementById("rfidInput");
    input.focus();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault(); // Evita el comportamiento predeterminado del formulario
  };

  return (
    <section className={styles.contenedorFormulario}>
      <form onSubmit={handleSubmit} className={styles.formulario}>
        <input
          type="text"
          id="rfidInput"
          className={styles.hiddenInput}
          onKeyPress={handleRFIDInput} // Usa onKeyPress para capturar la entrada completa
          autoFocus
          style={{ position: "absolute", opacity: 0, height: 0 }}
        />
        <div className={styles.contenedor1}>
          <div className={styles.cajaSemaforo}>
            <div className={styles.semaforoR}></div>
            <div className={styles.semaforoA}></div>
            <div className={styles.semaforoV}></div>
          </div>
          <div className={styles.tituloEstado}>
            <Label>Reporte de Robo</Label>
          </div>
        </div>
        {errorMessage && (
          <div className={styles.errorNotification}>
            <p>{errorMessage}</p>
          </div>
        )}
        <div className={styles.cajaMadre}>
          <div className={styles.contenedor2}>
            <div className={styles.imagenVehiculo}>
              <img src={imagenVehiculo} alt="Vehículo" />
            </div>
            <div className={styles.datosTitulo}>
              <Label>Datos del Vehiculo</Label>
            </div>
            <MostrarTexto dato={vehiculoData.uso || "N/A"}>USO</MostrarTexto>
            <MostrarTexto dato={vehiculoData.tipo || "N/A"}>Tipo</MostrarTexto>
            <MostrarTexto dato={vehiculoData.linea || "N/A"}>
              Linea
            </MostrarTexto>
            <MostrarTexto dato={vehiculoData.chasis || "N/A"}>
              Chasis
            </MostrarTexto>
            <MostrarTexto dato={vehiculoData.serie || "N/A"}>
              Serie
            </MostrarTexto>
            <MostrarTexto dato={vehiculoData.asientos || "N/A"}>
              Asientos
            </MostrarTexto>
            <MostrarTexto dato={vehiculoData.color || "N/A"}>
              Color
            </MostrarTexto>
            <MostrarTexto dato={vehiculoData.placa || "N/A"}>
              Placa
            </MostrarTexto>
            <MostrarTexto dato={vehiculoData.modelo || "N/A"}>
              Modelo
            </MostrarTexto>
          </div>
          <div className={styles.contenedor2}>
            <div className={styles.imagenConductor}>
              <img src={imagenUsuario} alt="Conductor" />
            </div>
            <div className={styles.datosTitulo}>
              <Label>Datos del Conductor</Label>
            </div>
            <MostrarTexto dato={conductorData.nombre || "N/A"}>
              Nombre
            </MostrarTexto>
            <MostrarTexto dato={conductorData.cui || "N/A"}>CUI</MostrarTexto>
            <MostrarTexto dato={conductorData.nit || "N/A"}>NIT</MostrarTexto>

            <div className={styles.datosTitulo}>
              <Label>Datos del Reporte</Label>
            </div>
            <MostrarTexto dato={reporteData.ubicacion || "N/A"}>
              <img
                src={iconUbicacion}
                alt="Ubicación"
                width="40px"
                height="40px"
              />
            </MostrarTexto>
            <MostrarTexto dato={reporteData.fecha || "N/A"}>
              <img src={iconCalendar} alt="Fecha" width="40px" height="40px" />
            </MostrarTexto>
            <MostrarTexto dato={reporteData.hora || "N/A"}>
              <img src={iconReloj} alt="Hora" width="40px" height="40px" />
            </MostrarTexto>
          </div>
        </div>
      </form>
    </section>
  );
};

export default RFID;
