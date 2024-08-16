import styles from "./RFID.module.css";
import imagenVehiculo from "./vehiculo.png";
import Label from "../../componentes/Label/Label";
import MostrarTexto from "../../componentes/LabelTexto/MostrarTexto";
import imagenUsuario from "./perfilMan.png";
import iconCalendar from "./calendar.png";
import iconReloj from "./iconReloj.png";
import iconUbicacion from "./iconUbicacion.png";
const RFID = () => {
  return (
    <>
      <section className={styles.contenedorFormulario}>
        <form action="" className={styles.formulario}>
          <div className={styles.contenedor1}>
            <div className={styles.cajaSemaforo}>
              <div className={styles.semaforoR}>
                <h1>df</h1>
              </div>
              <div className={styles.semaforoA}>
                <h1>df</h1>
              </div>
              <div className={styles.semaforoV}>
                <h1>df</h1>
              </div>
            </div>
            <div className={styles.tituloEstado}>
              <Label>Solvente</Label>
            </div>
            <div className={styles.imagenVehiculo}>
              <img src={imagenVehiculo} alt="" />
            </div>
          </div>
          <div className={styles.contenedor2}>
            <div className={styles.datosTitulo}>
              <Label>Datos del Vehiculo</Label>
            </div>
            <MostrarTexto dato={"JONONSINSKS"}>USO</MostrarTexto>
            <MostrarTexto dato={"JONONSINSKS"}>Tipo</MostrarTexto>
            <MostrarTexto dato={"JONONSINSKS"}>Linea</MostrarTexto>
            <MostrarTexto dato={"JONONSINSKS"}>Chasis</MostrarTexto>
            <MostrarTexto dato={"JONONSINSKS"}>Serie</MostrarTexto>
            <MostrarTexto dato={"JONONSINSKS"}>Asientos</MostrarTexto>
            <MostrarTexto dato={"JONONSINSKS"}>Color</MostrarTexto>
            <MostrarTexto dato={"JONONSINSKS"}>Placa</MostrarTexto>
            <MostrarTexto dato={"JONONSINSKS"}>Modelo</MostrarTexto>
          </div>
          <div className={styles.contenedor3}>
            <div className={styles.imagenConductor}>
              <img src={imagenUsuario} alt="" />
            </div>
          </div>
          <div className={styles.contenedor2}>
            <div className={styles.datosTitulo}>
              <Label>Datos del Conductor</Label>
            </div>
            <MostrarTexto dato={"JONONSINSKS"}>nombre</MostrarTexto>
            <MostrarTexto dato={"JONONSINSKS"}>cui</MostrarTexto>
            <MostrarTexto dato={"JONONSINSKS"}>nit</MostrarTexto>

            <div className={styles.datosTitulo}>
              <Label>Datos del Reporte</Label>
            </div>
            <MostrarTexto dato={"JONONSINSKS"}>
              <img src={iconUbicacion} alt="" width="40px" height="40px" />
            </MostrarTexto>
            <MostrarTexto dato={"JONONSINSKS"}>
              <img src={iconCalendar} alt="" width="40px" height="40px" />
            </MostrarTexto>
            <MostrarTexto dato={"JONONSINSKS"}>
              <img src={iconReloj} alt="" width="40px" height="40px" />
            </MostrarTexto>
          </div>
        </form>
      </section>
    </>
  );
};

export default RFID;
