import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Paginas/Login/Login";
import Lecturas from "./Paginas/Lecturas/Lecturas";
import RFID from "./Paginas/RFID/RFID";
import GenerarReporte from "./Paginas/Generador_Reporte/GenerarReporte";
import "./index.css";
import Header from "./componentes/Header/Header";
import Contenedor from "./componentes/Contenedor/Contenedor";
import RegistroUsuario from "./componentes/RegistrarUsuario/Registro";
import Reset from "./componentes/RestablecerContraseña/ResetPassword";
import { GlobalProvider } from "./context/GlobalContext";

const App = () => {
  return (
    <GlobalProvider>
      <Router>
        <Contenedor>
          <Header />
          <Routes>
            <Route path="/*" element={<Login />} />
            <Route path="/Lecturas" element={<Lecturas />} />
            <Route path="/RFID" element={<RFID />} />
            <Route path="/GenerarReporte" element={<GenerarReporte />} />
            <Route path="/RegistroUsuario" element={<RegistroUsuario />} />
            <Route path="/Reset" element={<Reset />} />
          </Routes>
        </Contenedor>
      </Router>
    </GlobalProvider>
  );
};

export default App;
