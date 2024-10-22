import React, { useState, useEffect } from "react";
import Input from "../../componentes/Input/Input";
import Label from "../../componentes/Label/Label";
import styles from "./Login.module.css";
import logoLogin from "./Vector.png";
import iconUser from "./bx-user.svg.png";
import iconPassword from "./bxs-lock.svg.png";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/api"; // Asegúrate de que esta importación sea correcta
import { useAuth } from "../../context/AuthContext"; // Asegúrate de la ruta correcta

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Obtén la función de login del contexto

  useEffect(() => {
    const isEmailValid = username.includes("@") && username.includes(".");
    if (isEmailValid && password !== "") {
      setIsFormValid(true);
      setError("");
    } else {
      setIsFormValid(false);
      setError("Por favor, completa todos los campos correctamente.");
    }
  }, [username, password]);

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!isFormValid) {
      return;
    }

    try {
      const data = await loginUser(username, password);

      if (data.success) {
        login(); // Llama a la función de login para actualizar el estado de autenticación
        navigate("/RFID");
      } else {
        setError(data.message || "Credenciales incorrectas");
      }
    } catch (err) {
      setError(err.message || "Error al autenticar el usuario");
    }

    // Solo limpia los campos si el inicio de sesión es exitoso
    // setUsername("");
    // setPassword("");
  };

  return (
    <section className={styles.Cajaformulario}>
      <form onSubmit={handleLogin} className={styles.formulario}>
        <h1 className={styles.h1}>
          <img src={logoLogin} className={styles.iconLogin} alt="logoLogin" />
        </h1>
        <div className={styles.cajaTexto}>
          <Label htmlFor="username">
            <img src={iconUser} alt="" width="50" height="50" />
          </Label>
          <Input
            type="email"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="example@gmail.com"
            required // Agrega esta propiedad
          />
        </div>
        <div className={styles.cajaTexto}>
          <Label htmlFor="password">
            <img src={iconPassword} alt="" width="50" height="50" />
          </Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Escribe tu contraseña..."
            required // Agrega esta propiedad
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.cajaInfo}>
          {/* <Input type="checkbox" />
          <p>Recordar usuario</p> */}
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
