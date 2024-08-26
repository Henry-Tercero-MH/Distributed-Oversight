import React, { useState, useEffect } from "react";
import Input from "../../componentes/Input/Input";
import Label from "../../componentes/Label/Label";
import styles from "./Login.module.css";
import logoLogin from "./Vector.png";
import iconUser from "./bx-user.svg.png";
import iconPassword from "./bxs-lock.svg.png";
import { Link } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  // useEffect para validar el formulario en tiempo real
  useEffect(() => {
    if (username !== "" && password !== "") {
      setIsFormValid(true);
      setError("");
    } else {
      setIsFormValid(false);
      setError("Por favor, completa todos los campos.");
    }
  }, [username, password]); // Se ejecuta cada vez que username o password cambian

  const handleLogin = (event) => {
    event.preventDefault();

    if (!isFormValid) {
      return;
    }

    // Aquí iría la lógica para autenticar al usuario (ej. llamada a una API)
    console.log("Username:", username);
    console.log("Password:", password);

    // Limpiar los campos si el login es exitoso
    setUsername("");
    setPassword("");
  };

  return (
    <section className={styles.Cajaformulario}>
      <form onSubmit={handleLogin} className={styles.formulario}>
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
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="example@gmail.com"
          />
        </div>
        <div className={styles.cajaTexto}>
          <Label htmlFor="password">
            <img src={iconPassword} alt="" width="35" height="35" />
          </Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Escribe tu contraseña..."
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.cajaInfo}>
          <Input type="checkbox" />
          <p>Recordar usuario</p>
          <Link to="/Reset">
            <div className={styles.items}>
              <p>¿Olvidó su contraseña?</p>
            </div>
          </Link>
        </div>

        <button type="submit" className={styles.boton} disabled={!isFormValid}>
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
