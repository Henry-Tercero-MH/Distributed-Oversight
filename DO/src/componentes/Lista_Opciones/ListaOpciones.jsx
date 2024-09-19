import React from "react";
import styles from "./ListaOpciones.module.css"; // Estilos específicos del select

const SelectList = ({ id, value, onChange, options, placeholder }) => {
  return (
    <div className={styles.grupoEntrada}>
      <label htmlFor={id} className={styles.label}></label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className={styles.select}
      >
        <option value="" disabled>
          {placeholder}
        </option>{" "}
        {/* Hacer el placeholder no seleccionable */}
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectList;
