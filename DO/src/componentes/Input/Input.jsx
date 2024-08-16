import styles from "./Input.module.css";

const Input = (props) => {
  const { type, id, placeholder } = props;
  return (
    <input
      type={type}
      id={id}
      placeholder={placeholder}
      className={styles.input}
    />
  );
};

export default Input;
