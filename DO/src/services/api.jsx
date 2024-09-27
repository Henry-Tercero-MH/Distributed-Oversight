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
    if (!response.ok) {
      throw new Error("Error al verificar el correo electrónico.");
    }
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

// Función para cambiar la contraseña
export const changePassword = async (token, newPassword) => {
  try {
    const response = await fetch(`${API_URL}/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, newPassword }),
    });

    if (!response.ok) {
      throw new Error("Error al cambiar la contraseña");
    }

    const data = await response.json();
    return data; // Retornamos el resultado del cambio de contraseña
  } catch (error) {
    throw new Error(error.message || "Error de red");
  }
};

// Función para obtener los datos de un usuario autenticado (por ejemplo, para perfil)
export const getUserProfile = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/usuarios/${userId}`);
    if (!response.ok) {
      throw new Error("Error al obtener el perfil del usuario");
    }
    const data = await response.json();
    return data; // Retornamos los datos del perfil
  } catch (error) {
    throw new Error(error.message || "Error de red");
  }
};

// Función para actualizar el perfil del usuario
export const updateUserProfile = async (userId, profileData) => {
  try {
    const response = await fetch(`${API_URL}/usuarios/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el perfil del usuario");
    }

    const data = await response.json();
    return { success: true, user: data }; // Retornamos el perfil actualizado
  } catch (error) {
    throw new Error(error.message || "Error de red");
  }
};

// Función para eliminar un usuario
export const deleteUser = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/usuarios/${userId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el usuario");
    }

    return { success: true, message: "Usuario eliminado con éxito" };
  } catch (error) {
    throw new Error(error.message || "Error de red");
  }
};

export const createReporte = async (data) => {
  try {
    const response = await fetch(`${API_URL}/reportes`, {
      method: "POST",
      // No se debe establecer Content-Type manualmente cuando se envía FormData
      body: data,
    });

    if (!response.ok) {
      throw new Error(`Error al crear el reporte: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error al enviar los datos:", error);
    throw error;
  }
};
export const getRFIDByPlate = async (placa) => {
  try {
    const response = await fetch(
      `http://localhost:3001/api/rfid?placa=${encodeURIComponent(placa)}`
    );

    if (!response.ok) {
      throw new Error("Error al obtener la información del vehículo");
    }

    const data = await response.json();
    return data; // Asegúrate de que esto sea el objeto del vehículo
  } catch (error) {
    console.error("Error en getRFIDByPlate:", error); // Esto te ayudará a depurar
    throw new Error("Error al obtener la información del vehículo");
  }
};
