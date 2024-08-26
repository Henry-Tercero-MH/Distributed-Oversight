import React, { useState, useEffect } from "react";
import Input from "../Input/Input";
import Label from "../Label/Label";
import styles from "./Registro.module.css";
import logoLogin from "./Vector.png";

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
  const [isFormValid, setIsFormValid] = useState(false);

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
      contraseña === confirmacionContraseña
    ) {
      setIsFormValid(true);
      setError("");
    } else {
      setIsFormValid(false);
      setError("Por favor, completa todos los campos correctamente.");
    }
  }, [formData]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));

    // Mostrar los datos actuales en la consola
    console.log("Datos del formulario actualizados:", {
      ...formData,
      [id]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid) {
      return;
    }

    // Aquí iría la lógica para registrar al usuario (ej. llamada a una API)
    console.log("Datos del formulario enviados:", formData);

    // Limpiar los campos después de un registro exitoso
    setFormData({
      nombre: "",
      apellido: "",
      email: "",
      puesto: "",
      contraseña: "",
      confirmacionContraseña: "",
      nip: "",
      cui: "",
    });
  };

  return (
    <>
      <section className={styles.contenedorFormulario}>
        <form onSubmit={handleSubmit} className={styles.formularioRegistro}>
          <h1 className={styles.contenedorLogo}>
            <img
              src={logoLogin}
              className={styles.imagenLogo}
              alt="logoLogin"
            />
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
                width="35"
                height="35"
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
              <Input
                type="text"
                id="puesto"
                value={formData.puesto}
                onChange={handleInputChange}
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
              <Label htmlFor="confirmacionContraseña">
                Confirmar Contraseña
              </Label>
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
                placeholder="digite su NIP"
              />
            </div>
            <div className={styles.grupoEntrada}>
              <Label htmlFor="cui">DPI</Label>
              <Input
                type="number"
                id="cui"
                value={formData.cui}
                onChange={handleInputChange}
                placeholder="digite su CUI"
              />
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button
            type="submit"
            className={styles.botonEnviar}
            disabled={!isFormValid}
          >
            REGISTRAR
          </button>
        </form>
      </section>
    </>
  );
};

export default RegistroUsuario;
