import styles from "./ResetPassword.module.css";
import { useState } from "react";
import { requestPasswordReset } from "../../services/api"; // Asegúrate de que la ruta sea correcta

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const result = await requestPasswordReset(email);
      setMessage(
        result.message || "Enlace de restablecimiento enviado a tu correo."
      );
    } catch (err) {
      setError(
        err.message || "Hubo un problema con el servidor. Intenta más tarde."
      );
    }
  };

  return (
    <div className={styles.resetContainer}>
      <h1 className={styles.title}>Restablecer Contraseña</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
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
          Enviar enlace de restablecimiento
        </button>
      </form>
      {message && <p className={styles.success}>{message}</p>}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default ResetPassword;
