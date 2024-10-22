import React, { useState, useEffect } from "react";
import Input from "../Input/Input";
import Label from "../Label/Label";
import styles from "./Registro.module.css";
import logoLogin from "./Vector.png";
import { registerUser, checkEmailExists } from "../../services/api";
import { useNavigate } from "react-router-dom";
import SelectList from "../Lista_Opciones/ListaOpciones";

const RegistroUsuario = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    puesto: "",
    contraseña: "",
    confirmacionContraseña: "",
    nip: "",
    cui: "",
  });

  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const {
      nombre,
      apellido,
      email,
      puesto,
      contraseña,
      confirmacionContraseña,
      nip,
      cui,
    } = formData;

    if (
      nombre &&
      apellido &&
      email &&
      puesto &&
      contraseña &&
      confirmacionContraseña &&
      nip &&
      cui &&
      !passwordError &&
      !emailError &&
      contraseña === confirmacionContraseña
    ) {
      setIsFormValid(true);
      setError("");
    } else {
      setIsFormValid(false);
    }
  }, [formData, passwordError, emailError]);

  const validatePassword = (pwd) => {
    let errors = "";
    if (pwd.length < 8) {
      errors += "La contraseña debe tener al menos 8 caracteres. ";
    }
    if (!/[a-zA-Z]/.test(pwd)) {
      errors += "La contraseña debe contener al menos una letra. ";
    }
    if (!/\d/.test(pwd)) {
      errors += "La contraseña debe contener al menos un número. ";
    }
    return errors.trim();
  };

  const handleInputChange = async (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));

    if (id === "contraseña") {
      setPasswordError(validatePassword(value));
    } else if (id === "confirmacionContraseña") {
      if (value !== formData.contraseña) {
        setPasswordError("Las contraseñas no coinciden.");
      } else {
        setPasswordError(validatePassword(formData.contraseña));
      }
    } else if (id === "email") {
      try {
        const exists = await checkEmailExists(value);
        if (exists) {
          setEmailError("El correo electrónico ya está registrado.");
        } else {
          setEmailError("");
        }
      } catch (err) {
        console.log(err);
        setError("Error al verificar el correo electrónico.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      setError("Por favor, completa todos los campos correctamente.");
      return;
    }

    try {
      const response = await registerUser(formData);
      console.log("Usuario registrado:", response);

      alert("Usuario agregado exitosamente");

      navigate("/login");
    } catch (error) {
      setError(error.message || "Error al registrar el usuario.");
    }
  };

  return (
    <section className={styles.contenedorFormulario}>
      <form onSubmit={handleSubmit} className={styles.formularioRegistro}>
        <h1 className={styles.titulo}>Registro</h1>
        <h1 className={styles.contenedorLogo}>
          <img src={logoLogin} className={styles.imagenLogo} alt="logoLogin" />
        </h1>
        <div className={styles.cajaEntrada}>
          <div className={styles.grupoEntrada}>
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              type="text"
              id="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="digita tu nombre..."
            />
          </div>
          <div className={styles.grupoEntrada}>
            <Label htmlFor="apellido">Apellido</Label>
            <Input
              type="text"
              id="apellido"
              value={formData.apellido}
              onChange={handleInputChange}
              placeholder="escribe tu apellido..."
            />
          </div>
        </div>
        <div className={styles.cajaEntrada}>
          <div className={styles.grupoEntrada}>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="example@gmail.com"
            />
          </div>
          <div className={styles.grupoEntrada}>
            <Label htmlFor="puesto">Puesto</Label>
            <SelectList
              id="puesto"
              label="Puesto"
              value={formData.puesto}
              onChange={handleInputChange}
              options={[
                "Civil",
                "Comisario",
                "Subcomisario",
                "Analista de Datos",
              ]}
              placeholder="Seleccione su puesto"
            />
          </div>
        </div>
        <div className={styles.cajaEntrada}>
          <div className={styles.grupoEntrada}>
            <Label htmlFor="contraseña">Contraseña</Label>
            <Input
              type="password"
              id="contraseña"
              value={formData.contraseña}
              onChange={handleInputChange}
              placeholder="digita una contraseña"
            />
          </div>
          <div className={styles.grupoEntrada}>
            <Label htmlFor="confirmacionContraseña">Confirmar Contraseña</Label>
            <Input
              type="password"
              id="confirmacionContraseña"
              value={formData.confirmacionContraseña}
              onChange={handleInputChange}
              placeholder="confirme la contraseña"
            />
          </div>
        </div>
        <div className={styles.cajaEntrada}>
          <div className={styles.grupoEntrada}>
            <Label htmlFor="nip">NIP</Label>
            <Input
              type="number"
              id="nip"
              value={formData.nip}
              onChange={handleInputChange}
              placeholder="NIP de seguridad..."
            />
          </div>
          <div className={styles.grupoEntrada}>
            <Label htmlFor="cui">CUI</Label>
            <Input
              type="text"
              id="cui"
              value={formData.cui}
              onChange={handleInputChange}
              placeholder="DPI..."
            />
          </div>
        </div>
        {passwordError && <p className={styles.error}>{passwordError}</p>}
        {emailError && <p className={styles.error}>{emailError}</p>}
        {error && <p className={styles.error}>{error}</p>}
        <button
          type="submit"
          className={styles.botonRegistro}
          disabled={!isFormValid}
        >
          Registrar usuario
        </button>
      </form>
    </section>
  );
};

export default RegistroUsuario;
