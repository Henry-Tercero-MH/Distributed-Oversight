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

// Función para registrar un nuevo usuario, con verificación de correo
export const registerUser = async (userData) => {
  try {
    // Verificar si el correo ya existe
    const emailExists = await checkEmailExists(userData.email);

    if (emailExists) {
      return { success: false, message: "El correo ya está registrado." };
    }

    // Si el correo no existe, proceder con el registro
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
// Función para solicitar el restablecimiento de contraseña
export const requestPasswordReset = async (email) => {
  try {
    const response = await fetch(`${API_URL}/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error("Error al solicitar el restablecimiento de contraseña");
    }

    const data = await response.json();
    return data; // Aquí asumimos que el backend devuelve un objeto con un mensaje
  } catch (error) {
    throw new Error(error.message || "Error de red");
  }
};
