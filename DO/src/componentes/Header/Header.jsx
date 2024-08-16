import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import logo from "./logo.png";
import iconMenu from "./iconMenu.png";
import iconHome from "./home.png";
import iconRfid from "./rfid.png";
import iconBarras from "./barras.png";
import iconPdf from "./pdf.png";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.cajaHeader}>
          <img src={logo} className={styles.logo} alt="logo" />
          <img
            src={iconMenu}
            className={styles.iconMenu}
            alt="icono_menu"
            onClick={toggleMenu}
          />
        </div>
        {isMenuOpen && (
          <nav className={styles.menu}>
            <ul className={styles.menuList}>
              <li>
                <Link to="/Login" onClick={toggleMenu}>
                  <div className={styles.items}>
                    <img src={iconHome} alt="" /> Home
                  </div>
                </Link>
              </li>
              <li>
                <Link to="/RFID" onClick={toggleMenu}>
                  <div className={styles.items}>
                    <img src={iconRfid} alt="" /> Lector
                  </div>
                </Link>
              </li>
              <li>
                <Link to="/Lecturas" onClick={toggleMenu}>
                  <div className={styles.items}>
                    <img src={iconBarras} alt="" /> Lecturas
                  </div>
                </Link>
              </li>
              <li>
                <Link to="/GenerarReporte" onClick={toggleMenu}>
                  <div className={styles.items}>
                    <img src={iconPdf} alt="" /> Generar Reporte
                  </div>
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </header>
    </>
  );
};

export default Header;
