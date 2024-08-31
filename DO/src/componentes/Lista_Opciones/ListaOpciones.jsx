import React from "react";
import styles from "./ListaOpciones.module.css";

const ListaOpciones = ({ valor, setEquipo, placeholder }) => {
  const Equipos = ["Reporte de Robo", "Solvente", "Insolvente"];

  const manejarCambio = (e) => {
    setEquipo(e.target.value);
  };

  return (
    <div className={styles.lista}>
      <select value={valor} onChange={manejarCambio}>
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {Equipos.map((equipo, index) => (
          <option key={index} value={equipo}>
            {equipo}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ListaOpciones;
