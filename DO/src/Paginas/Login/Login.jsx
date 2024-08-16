import Input from "../../componentes/Input/Input";
import Label from "../../componentes/Label/Label";
import styles from "./Login.module.css";
import logoLogin from "./Vector.png";
import iconUser from "./bx-user.svg.png";
import iconPassword from "./bxs-lock.svg.png";
import { Link } from "react-router-dom";
const Login = () => {
  return (
    <section className={styles.Cajaformulario}>
      <form action="" className={styles.formulario}>
        <h1 className={styles.h1}>
          <img src={logoLogin} className={styles.iconLogin} alt="logoLogin" />
        </h1>
        <div className={styles.cajaTexto}>
          <Label htmlFor="username">
            <img src={iconUser} alt="" width="35" height="35" />
          </Label>
          <Input
            type="email"
            id="username"
            placeholder="example@gmail.com"
            width="35"
            height="35"
          />
        </div>
        <div className={styles.cajaTexto}>
          <Label htmlFor="password">
            <img src={iconPassword} alt="" width="35" height="35" />
          </Label>
          <Input
            type="password"
            id="password"
            placeholder="escribe tu constraseña.."
          />
        </div>
        <div className={styles.cajaInfo}>
          <Input type="checkbox"></Input> <p>recordar usuario</p>
          <p>¿olvido su contraseña?</p>
        </div>

        <button type="submit" className={styles.boton}>
          LOGIN
        </button>

        <Link to="/RegistroUsuario">
          <div className={styles.items}>
            <p>¿No tiene una cuenta?</p>
          </div>
        </Link>
      </form>
    </section>
  );
};

export default Login;
