const API_URL = "http://localhost:3001/api"; // Cambia esto a la URL de tu API

// Función para autenticar un usuario
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(
      `${API_URL}/usuarios?email=${encodeURIComponent(
        email
      )}&contraseña=${encodeURIComponent(password)}`
    );
    if (!response.ok) {
      throw new Error("Error al autenticar el usuario");
    }
    const data = await response.json();
    if (data.length > 0) {
      return { success: true, user: data[0] }; // Asumimos que retornamos el primer usuario encontrado
    } else {
      return { success: false, message: "Credenciales incorrectas" };
    }
  } catch (error) {
    throw new Error(error.message || "Error de red");
  }
};

// Función para verificar si un correo electrónico ya existe en la base de datos
export const checkEmailExists = async (email) => {
  try {
    const response = await fetch(
      `${API_URL}/check-email?email=${encodeURIComponent(email)}`
    );
    const data = await response.json();
    return data.exists; // Suponiendo que el backend responde con { exists: true/false }
  } catch (error) {
    console.log(error);
    throw new Error("Error al verificar el correo electrónico.");
  }
};

// Función para registrar un nuevo usuario
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/usuarios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error("Error al registrar el usuario");
    }
    const data = await response.json();
    return { success: true, user: data }; // Retornamos el usuario registrado
  } catch (error) {
    throw new Error(error.message || "Error de red");
  }
};
