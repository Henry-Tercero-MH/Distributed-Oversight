import React, { useState, useEffect } from "react";

import styles from "./RFID.module.css";
import Label from "../../componentes/Label/Label";
import MostrarTexto from "../../componentes/LabelTexto/MostrarTexto";
import iconCalendar from "./calendar.png";
import iconReloj from "./iconReloj.png";
import iconUbicacion from "./iconUbicacion.png";
import { getRFIDByPlate, generateLectura } from "./../../services/api";
import sonidoRojo from "./rojo.mp3";
import sonidoVerde from "./verde.mp3";
import sonidoAmarillo from "./amarillo.mp3";
import { useAuth } from "../../context/AuthContext"; // Asegúrate de la ruta correcta
import AccessDenied from "../../componentes/AccessDenied";
import imag from "..//..//../public/denegado.jpeg"; // Ajusta la ruta de la imagen

const RFID = () => {
  const { isAuthenticated } = useAuth(); // Obtén el estado de autenticación

  if (!isAuthenticated) {
    return (
      <AccessDenied
        message="Acceso denegado. Por favor, inicia sesión."
        imageUrl={imag} // Ajusta la ruta de la imagen
      />
    );
  }
  const audioRojo = new Audio(sonidoRojo);
  const audioVerde = new Audio(sonidoVerde);
  const audioAmarillo = new Audio(sonidoAmarillo);

  const [vehiculoData, setVehiculoData] = useState({});
  const [conductorData, setConductorData] = useState({});
  const [reporteData, setReporteData] = useState({
    ubicacion: "",
    fecha: "",
    hora: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [estadoClass, setEstadoClass] = useState(styles.default);

  const fetchVehicleData = async (tagID) => {
    try {
      const data = await getRFIDByPlate(tagID);
      console.log("Datos recibidos del API:", data);
      if (data) {
        setVehiculoData(data);
        setConductorData(data || {});
        setErrorMessage("");

        // Captura la ubicación y la fecha/hora
        captureLocationAndTime();

        // Espera un momento para capturar la ubicación y la fecha antes de enviar
        setTimeout(() => {
          // Llama automáticamente a handleSubmit después de obtener los datos
          handleSubmit();
        }, 1000); // Agrega un pequeño retraso para asegurar que los datos estén listos
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

          // Crea un enlace de Google Maps usando las coordenadas
          const ubicacionEnlace = `https://www.google.com/maps?q=${latitude},${longitude}`;

          setReporteData({
            ubicacion: ubicacionEnlace, // Guarda el enlace en lugar de las coordenadas
            fecha: fecha,
            hora: hora,
          });

          console.log("Datos después de la lectura:", {
            ubicacion: ubicacionEnlace,
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
    const tagID = event.target.value.trim();
    console.log("ID RFID ingresado:", tagID);

    if (event.key === "Enter") {
      if (tagID.length === 8) {
        fetchVehicleData(tagID);
        event.target.value = "";
      } else {
        setErrorMessage("El ID RFID debe tener 8 caracteres.");
      }
      event.preventDefault();
    }
  };

  useEffect(() => {
    const input = document.getElementById("rfidInput");
    input.focus();
  }, []);

  useEffect(() => {
    if (vehiculoData.estado === "Reporte de Robo") {
      setEstadoClass(`${styles.tituloEstado} ${styles.rojo}`);
      audioRojo.play();
    } else if (vehiculoData.estado === "Solvente") {
      setEstadoClass(`${styles.tituloEstado} ${styles.verde}`);
      audioVerde.play();
    } else if (vehiculoData.estado === "Insolvente") {
      setEstadoClass(`${styles.tituloEstado} ${styles.yellow}`);
      audioAmarillo.play();
    } else {
      setEstadoClass(styles.default);
    }
  }, [vehiculoData.estado]);

  const handleSubmit = async () => {
    // Asegúrate de que los datos del vehículo, conductor y reporte están completos
    if (!vehiculoData || !conductorData || !reporteData) {
      console.error("Datos incompletos para enviar.");
      return;
    }

    const datosAEnviar = {
      uso: vehiculoData.uso,
      tipo: vehiculoData.tipo,
      linea: vehiculoData.linea,
      chasis: vehiculoData.chasis,
      serie: vehiculoData.serie,
      asientos: vehiculoData.asientos,
      color: vehiculoData.color,
      placa: vehiculoData.placa,
      modelo: vehiculoData.modelo,
      nombre: conductorData.nombre,
      estado: conductorData.estado,
      cui: conductorData.cui,
      nit: conductorData.nit,
      fotoVehiculo: vehiculoData.fotoVehiculo,
      fotoConductor: vehiculoData.fotoConductor,
      ubicacion: reporteData.ubicacion,
      fecha: reporteData.fecha,
      hora: reporteData.hora,
    };

    console.log("Datos a enviar:", datosAEnviar);

    try {
      const resultado = await generateLectura(datosAEnviar);
      console.log("Datos enviados con éxito:", resultado);
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    }
  };

  return (
    <section className={styles.contenedorFormulario}>
      <form className={styles.formulario}>
        <input
          type="text"
          id="rfidInput"
          className={styles.hiddenInput}
          onKeyPress={handleRFIDInput}
          autoFocus
          style={{ position: "absolute", opacity: 0, height: 0 }}
        />
        <div className={styles.contenedor1}>
          <div className={styles.cajaSemaforo}>
            <div className={styles.semaforoR}></div>
            <div className={styles.semaforoA}></div>
            <div className={styles.semaforoV}></div>
          </div>
          <div className={estadoClass}>
            <Label className={styles.estado}>
              {vehiculoData.estado || "Estado no disponible"}
            </Label>
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
              <img src={vehiculoData.fotoVehiculo} alt="Vehículo" />
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
              <img src={conductorData.fotoConductor} alt="Conductor" />
            </div>
            <div className={styles.datosTitulo}>
              <Label>Datos del Conductor</Label>
            </div>
            <MostrarTexto dato={conductorData.nombre || "N/A"}>
              Nombre
            </MostrarTexto>
            <MostrarTexto dato={conductorData.estado || "N/A"}>
              Estado
            </MostrarTexto>
            <MostrarTexto dato={conductorData.cui || "N/A"}>CUI</MostrarTexto>
            <MostrarTexto dato={conductorData.nit || "N/A"}>NIT</MostrarTexto>
            <MostrarTexto
              dato={reporteData.ubicacion || "Ubicación no disponible"}
            >
              <img src={iconUbicacion} width="40px" alt="" />
            </MostrarTexto>
            <MostrarTexto dato={reporteData.fecha || "Fecha no disponible"}>
              {" "}
              <img src={iconCalendar} width="50px" alt="" />{" "}
            </MostrarTexto>

            <MostrarTexto dato={reporteData.hora || "Hora no disponible"}>
              {" "}
              <img src={iconReloj} width="50px" alt="" />
            </MostrarTexto>
          </div>
        </div>
      </form>
    </section>
  );
};

export default RFID;
