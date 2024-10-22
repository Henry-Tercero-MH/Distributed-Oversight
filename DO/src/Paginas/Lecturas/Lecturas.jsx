import { useEffect, useState } from "react"; // Importa useEffect y useState
import styles from "./Lecturas.module.css";
import Input from "../../componentes/Input/Input";
import Label from "../../componentes/Label/Label";
import MostrarTexto from "../../componentes/LabelTexto/MostrarTexto";
import { getLecturas } from "../../services/api"; // Importa la función getLecturas
import { useAuth } from "../../context/AuthContext"; // Asegúrate de la ruta correcta
import AccessDenied from "../../componentes/AccessDenied";
import imag from "..//..//../public/denegado.jpeg"; // Ajusta la ruta de la imagen
const Lecturas = () => {
  const { isAuthenticated } = useAuth(); // Obtén el estado de autenticación

  if (!isAuthenticated) {
    return (
      <AccessDenied
        message="Acceso denegado. Por favor, inicia sesión."
        imageUrl={imag} // Ajusta la ruta de la imagen
      />
    );
  }
  const [lecturas, setLecturas] = useState([]); // Estado para almacenar las lecturas
  const [error, setError] = useState(null); // Estado para manejar errores
  const [detallesVisible, setDetallesVisible] = useState(null); // Estado para manejar la visibilidad de los detalles
  const [filtro, setFiltro] = useState("todo"); // Estado para manejar el filtro (día, semana, mes, todo)

  useEffect(() => {
    const fetchLecturas = async () => {
      try {
        const data = await getLecturas(); // Llama a la función getLecturas
        setLecturas(data); // Actualiza el estado con los datos obtenidos
      } catch (error) {
        console.error("Error al obtener las lecturas:", error);
        setError(error.message); // Actualiza el estado con el mensaje de error
      }
    };

    fetchLecturas(); // Llama a la función para obtener las lecturas
  }, []); // El array vacío asegura que solo se ejecute al montar el componente

  const toggleDetalles = (index) => {
    setDetallesVisible((prevIndex) => (prevIndex === index ? null : index));
  };

  // Función para filtrar lecturas
  const filtrarLecturas = () => {
    const ahora = new Date();
    return lecturas.filter((lectura) => {
      const fechaLectura = new Date(lectura.fecha); // Asegúrate de que la fecha está en formato correcto

      if (filtro === "dia") {
        return fechaLectura.toDateString() === ahora.toDateString();
      } else if (filtro === "semana") {
        const inicioSemana = new Date(ahora);
        inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay()); // Inicio de la semana (Domingo)
        const finSemana = new Date(inicioSemana);
        finSemana.setDate(inicioSemana.getDate() + 6); // Fin de la semana (Sábado)

        return fechaLectura >= inicioSemana && fechaLectura <= finSemana;
      } else if (filtro === "mes") {
        return (
          fechaLectura.getMonth() === ahora.getMonth() &&
          fechaLectura.getFullYear() === ahora.getFullYear()
        );
      }

      return true; // Retorna todas las lecturas si el filtro es "todo"
    });
  };

  return (
    <>
      <section className={styles.contenedorLecturas}>
        <form action="" className={styles.formularioLecturas}>
          <div className={styles.titulo}>
            <Label>Lecturas recientes</Label>
          </div>
          <span>Filtrar por:</span>
          <div className={styles.cajaBotones}>
            <button type="button" onClick={() => setFiltro("dia")}>
              Día
            </button>
            <button type="button" onClick={() => setFiltro("semana")}>
              Semana
            </button>
            <button type="button" onClick={() => setFiltro("mes")}>
              Mes
            </button>
            <button type="button" onClick={() => setFiltro("todo")}>
              Todo
            </button>
          </div>
          <div className={styles.cajaFecha}>
            <div className={styles.cajaDato}>
              <Label>Desde</Label>
              <Input type="date" />
            </div>
            <div className={styles.cajaDato}>
              <Label>Hasta</Label>
              <Input type="date" />
            </div>
          </div>
          <div className={styles.cajaDatos}>
            {error && <p className={styles.error}>{error}</p>}{" "}
            {/* Mostrar error si existe */}
            {filtrarLecturas().length > 0 ? (
              filtrarLecturas().map((lectura, index) => (
                <div key={index} className={styles.dato}>
                  <MostrarTexto dato={lectura.nombre}>Conductor</MostrarTexto>
                  <MostrarTexto dato={lectura.placa}>Placa</MostrarTexto>
                  <button type="button" onClick={() => toggleDetalles(index)}>
                    {detallesVisible === index ? "Ocultar Datos" : "Ver Datos"}
                  </button>
                  {detallesVisible === index && (
                    <div className={styles.detalles}>
                      <MostrarTexto dato={lectura.uso}>Uso</MostrarTexto>
                      <MostrarTexto dato={lectura.tipo}>Tipo</MostrarTexto>
                      <MostrarTexto dato={lectura.linea}>Línea</MostrarTexto>
                      <MostrarTexto dato={lectura.chasis}>Chasis</MostrarTexto>
                      <MostrarTexto dato={lectura.serie}>Serie</MostrarTexto>
                      <MostrarTexto dato={lectura.asientos}>
                        Asientos
                      </MostrarTexto>
                      <MostrarTexto dato={lectura.color}>Color</MostrarTexto>
                      <MostrarTexto dato={lectura.modelo}>Modelo</MostrarTexto>
                      <MostrarTexto dato={lectura.estado}>Estado</MostrarTexto>
                      <MostrarTexto dato={lectura.cui}>CUI</MostrarTexto>
                      <MostrarTexto dato={lectura.nit}>NIT</MostrarTexto>
                      <img src={lectura.fotoVehiculo} alt="Vehículo" />
                      <img src={lectura.fotoConductor} alt="Conductor" />
                      <MostrarTexto
                        dato={
                          <a
                            href={lectura.ubicacion}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Ver Ubicación
                          </a>
                        }
                      >
                        Ubicación
                      </MostrarTexto>

                      <MostrarTexto dato={lectura.fecha}>Fecha</MostrarTexto>
                      <MostrarTexto dato={lectura.hora}>Hora</MostrarTexto>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No hay lecturas disponibles.</p>
            )}
          </div>
        </form>
      </section>
    </>
  );
};

export default Lecturas;
