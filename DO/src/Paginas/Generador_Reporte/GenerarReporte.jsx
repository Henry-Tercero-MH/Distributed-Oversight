import styles from "./GenerarReporte.module.css";
import Label from "../../componentes/Label/Label";
import Input from "../../componentes/Input/Input";
import ListaOpciones from "../../componentes/Lista_Opciones/ListaOpciones";
import { useState } from "react";

const GenerarReporte = () => {
  const [estado, setEstado] = useState(""); // Manejo del estado seleccionado

  return (
    <section className={styles.cajaGenerarReporte}>
      <form action="" className={styles.cajaFormularioGenerarReporte}>
        <div className={styles.titulo}>
          <Label>Generar Reporte</Label>
        </div>
        <div className={styles.cajaIngresodatos}>
          <Label>Digite su placa</Label>
          <Input type="text" placeholder="Ingrese su placa..." />

          <Label>Valide su CUI</Label>
          <Input type="text" placeholder="Ingrese su CUI..." />

          <Label>Capture una foto</Label>
          <button type="button">Capturar</button>

          <Label>Estado</Label>
          <ListaOpciones
            className={styles.listaOpciones}
            titulo="Estado"
            valor={estado}
            setEquipo={setEstado}
            placeholder="Seleccione una categoría"
          />
        </div>
        <button type="submit">Reportar</button>
      </form>
    </section>
  );
};

export default GenerarReporte;
