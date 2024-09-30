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
  const [cuiError, setCuiError] = useState(""); // Estado para el error de CUI
  const [nipError, setNipError] = useState(""); // Estado para el error de NIP
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
      cui, // Añadido CUI
    } = formData;

    if (
      nombre &&
      apellido &&
      email &&
      puesto &&
      contraseña &&
      confirmacionContraseña &&
      nip &&
      cui && // Verificar CUI
      !passwordError &&
      !emailError &&
      !cuiError && // Verificar error de CUI
      !nipError && // Verificar error de NIP
      contraseña === confirmacionContraseña
    ) {
      setIsFormValid(true);
      setError("");
    } else {
      setIsFormValid(false);
    }
  }, [formData, passwordError, emailError, cuiError, nipError]); // Añadido nipError

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

  // Función para validar el CUI
  const cuiIsValid = (cui) => {
    if (!cui) return true; // CUI vacío es válido en este contexto

    const cuiRegExp = /^[0-9]{4}\s?[0-9]{5}\s?[0-9]{4}$/;
    if (!cuiRegExp.test(cui)) {
      return false; // Formato inválido
    }

    cui = cui.replace(/\s/g, "");
    const depto = parseInt(cui.substring(9, 11), 10);
    const muni = parseInt(cui.substring(11, 13), 10);
    const numero = cui.substring(0, 8);
    const verificador = parseInt(cui.substring(8, 9), 10);

    const munisPorDepto = [
      17, 8, 16, 16, 13, 14, 19, 8, 24, 21, 9, 30, 32, 21, 8, 17, 14, 5, 11, 11,
      7, 17,
    ];

    if (depto === 0 || muni === 0) return false;
    if (depto > munisPorDepto.length) return false;
    if (muni > munisPorDepto[depto - 1]) return false;

    let total = 0;
    for (let i = 0; i < numero.length; i++) {
      total += numero[i] * (i + 2);
    }

    const modulo = total % 11;
    return modulo === verificador;
  };

  // Función para validar el NIP
  const nipIsValid = (nip) => {
    const nipRegExp = /^[0-9]{5}$/; // Validación de 5 dígitos numéricos
    return nipRegExp.test(nip);
  };

  const handleInputChange = async (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));

    switch (id) {
      case "contraseña":
        setPasswordError(validatePassword(value));
        break;
      case "confirmacionContraseña":
        if (value !== formData.contraseña) {
          setPasswordError("Las contraseñas no coinciden.");
        } else {
          setPasswordError(validatePassword(formData.contraseña));
        }
        break;
      case "email":
        try {
          const exists = await checkEmailExists(value);
          setEmailError(
            exists ? "El correo electrónico ya está registrado." : ""
          );
        } catch (err) {
          console.log(err);
          setError("Error al verificar el correo electrónico.");
        }
        break;
      case "cui":
        if (!cuiIsValid(value)) {
          setCuiError("CUI con formato inválido o no existe.");
        } else {
          setCuiError("");
        }
        break;
      case "nip":
        if (!nipIsValid(value)) {
          setNipError("El NIP debe tener exactamente 5 dígitos.");
        } else {
          setNipError("");
        }
        break;
      default:
        break;
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
            <div className={styles.nip}>
              <div className={styles.inputContainer}>
                <Input
                  type="number"
                  id="nip"
                  value={formData.nip}
                  onChange={handleInputChange}
                  placeholder="digita tu NIP"
                />
                <Label>-P</Label>
              </div>
            </div>
          </div>
          <div className={styles.grupoEntrada}>
            <Label htmlFor="cui">CUI</Label>
            <Input
              type="text"
              id="cui"
              value={formData.cui}
              onChange={handleInputChange}
              placeholder="digita tu CUI"
            />
          </div>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        {passwordError && <p className={styles.error}>{passwordError}</p>}
        {emailError && <p className={styles.error}>{emailError}</p>}
        {cuiError && <p className={styles.error}>{cuiError}</p>}{" "}
        {/* Mensaje de error para CUI */}
        {nipError && <p className={styles.error}>{nipError}</p>}{" "}
        {/* Mensaje de error para NIP */}
        <button
          type="submit"
          className={styles.botonRegistro}
          disabled={!isFormValid}
        >
          Registrar
        </button>
      </form>
    </section>
  );
};

export default RegistroUsuario;
