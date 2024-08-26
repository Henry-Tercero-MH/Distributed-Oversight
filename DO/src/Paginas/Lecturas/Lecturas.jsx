import styles from "./Lecturas.module.css";
import Input from "../../componentes/Input/Input";
import Label from "../../componentes/Label/Label";
import MostrarTexto from "../../componentes/LabelTexto/MostrarTexto";
const Lecturas = () => {
  return (
    <>
      <section className={styles.contenedorLecturas}>
        <form action="" className={styles.formularioLecturas}>
          <div className={styles.titulo}>
            <Label>Lecturas recientes</Label>
          </div>
          <span>Filtrar por:</span>
          <div className={styles.cajaBotones}>
            <button>Dia</button>
            <button>Semana</button>
            <button>Mes</button>
          </div>
          <div className={styles.cajaFecha}>
            <div className={styles.cajaDato}>
              <Label>Desde</Label>
              <Input type="date"></Input>
            </div>
            <div className={styles.cajaDato}>
              <Label>hasta</Label>
              <Input type="date"></Input>
            </div>
          </div>
          <div className={styles.cajaDatos}>
            <div className={styles.dato}>
              <MostrarTexto dato={"Juan Pila"}>Conductor</MostrarTexto>
              <MostrarTexto dato={"P-154MkD"}>Placa</MostrarTexto>
              <button>Ver Datos</button>
            </div>
            <div className={styles.dato}>
              <MostrarTexto dato={"Juan Pila"}>Conductor</MostrarTexto>
              <MostrarTexto dato={"P-154MkD"}>Placa</MostrarTexto>
              <button>Ver Datos</button>
            </div>
            <div className={styles.dato}>
              <MostrarTexto dato={"Juan Pila"}>Conductor</MostrarTexto>
              <MostrarTexto dato={"P-154MkD"}>Placa</MostrarTexto>
              <button>Ver Datos</button>
            </div>
            <div className={styles.dato}>
              <MostrarTexto dato={"Juan Pila"}>Conductor</MostrarTexto>
              <MostrarTexto dato={"P-154MkD"}>Placa</MostrarTexto>
              <button>Ver Datos</button>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default Lecturas;
