import styles from "./Contenedor.module.css";

const Contenedor = ({ children }) => {
  return (
    <>
      <section className={styles.container}>{children}</section>
    </>
  );
};

export default Contenedor;
