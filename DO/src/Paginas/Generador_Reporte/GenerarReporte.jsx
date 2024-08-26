import styles from "./GenerarReporte.module.css";
import Label from "../../componentes/Label/Label";
import Input from "../../componentes/Input/Input";

const GenerarReporte = () => {
  return (
    <>
      <section className={styles.cajaGenerarReporte}>
        <form action="" className={styles.cajaFormularioGenerarReporte}>
          <div className={styles.titulo}>
            <Label>Generar Reporte</Label>
          </div>
          <div className={styles.cajaIngresodatos}>
            <Label>Digite su placa</Label>
            <Input type="text" placeholder="Ingrese su placa"></Input>
            <Label>Valide su CUI</Label>
            <Input type="text"></Input>
            <Label>capture una foto</Label>
            <button>capturar</button>

            <Label>Estado</Label>
            <Input type="text"></Input>
          </div>
          <button>reportar</button>
        </form>
      </section>
    </>
  );
};

export default GenerarReporte;
