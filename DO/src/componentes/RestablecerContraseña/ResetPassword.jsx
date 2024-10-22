import styles from "./ResetPassword.module.css";
import { useState } from "react";
import { changePassword, checkEmailExists } from "../../services/api"; // Asegúrate de que la ruta sea correcta

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false); // Nuevo estado para manejar la validación del correo

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const emailExists = await checkEmailExists(email); // Verifica si el correo electrónico existe
      if (emailExists) {
        setIsEmailValid(true); // Si el correo existe, permite continuar
      } else {
        setError("El correo electrónico no está registrado."); // Maneja el caso donde el correo no existe
      }
    } catch (err) {
      setError(
        err.message || "Hubo un problema con el servidor. Intenta más tarde."
      );
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // Verifica si las contraseñas coinciden
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const result = await changePassword(email, newPassword); // Asegúrate de que tu API acepte la nueva contraseña
      setMessage(result.message || "Contraseña restablecida exitosamente.");
    } catch (err) {
      setError(
        err.message || "Hubo un problema con el servidor. Intenta más tarde."
      );
    }
  };

  return (
    <div className={styles.resetContainer}>
      <h1 className={styles.title}>Restablecer Contraseña</h1>
      {!isEmailValid ? (
        <form onSubmit={handleEmailSubmit} className={styles.form}>
          <label htmlFor="email" className={styles.label}>
            Ingresa tu correo electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Correo electrónico"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className={styles.button}>
            Validar Correo
          </button>
        </form>
      ) : (
        <form onSubmit={handlePasswordSubmit} className={styles.form}>
          <label htmlFor="newPassword" className={styles.label}>
            Nueva Contraseña
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            placeholder="Nueva contraseña"
            className={styles.input}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <label htmlFor="confirmPassword" className={styles.label}>
            Confirmar Contraseña
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirmar contraseña"
            className={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit" className={styles.button}>
            Restablecer Contraseña
          </button>
        </form>
      )}
      {message && <p className={styles.success}>{message}</p>}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default ResetPassword;
