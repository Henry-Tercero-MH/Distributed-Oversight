import styles from "./MostrarTexto.module.css";

const MostrarTexto = ({ children, dato }) => {
  return (
    <div className={styles.cajaTexto}>
      <label htmlFor="mostrar">{children}:</label>
      <span>{dato}</span>
    </div>
  );
};

export default MostrarTexto;
