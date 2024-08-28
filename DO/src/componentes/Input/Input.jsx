import styles from "./Input.module.css";

const Input = (props) => {
  const { type, id, value, onChange, placeholder } = props;
  return (
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={styles.input}
    />
  );
};

export default Input;
