import styles from "./Label.module.css"; // Asegúrate de que la ruta del archivo es correcta

const Label = ({ children }) => {
  return <label className={styles.label}>{children}</label>;
};

export default Label;
