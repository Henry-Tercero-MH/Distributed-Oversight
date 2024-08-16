import Input from "../Input/Input";
import Label from "../Label/Label";
import styles from "./Registro.module.css";
import logoLogin from "./Vector.png";

const RegistroUsuario = () => {
  return (
    <>
      <section className={styles.contenedorFormulario}>
        <form action="" className={styles.formularioRegistro}>
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
                placeholder="escribe tu apellido.."
              />
            </div>
            <div className={styles.grupoEntrada}>
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" placeholder="example@gmail.com" />
            </div>
            <div className={styles.grupoEntrada}>
              <Label htmlFor="puesto">Puesto</Label>
              <Input
                type="text"
                id="puesto"
                placeholder="Seleccione su puesto"
              />
            </div>
            <div className={styles.grupoEntrada}>
              <Label htmlFor="contraseña">Contraseña</Label>
              <Input
                type="password"
                id="contraseña"
                placeholder="digita una contraseña"
              />
            </div>
            <div className={styles.grupoEntrada}>
              <Label htmlFor="contraseña">Contraseña</Label>
              <Input
                type="password"
                id="contraseña"
                placeholder="confirme la constraseña"
              />
            </div>
            <div className={styles.grupoEntrada}>
              <Label htmlFor="nip">NIP</Label>
              <Input type="text" id="nip" placeholder="digite su NIP" />
            </div>
          </div>

          <button type="submit" className={styles.botonEnviar}>
            REGISTRAR
          </button>
        </form>
      </section>
    </>
  );
};

export default RegistroUsuario;
