const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const multer = require("multer"); // Asegúrate de haber instalado multer
const app = express();
const port = 3001;
// Importa uuid al principio de tu archivo
const { v4: uuidv4 } = require("uuid");

// Usa cors para permitir solicitudes desde otros dominios
app.use(cors());
app.use(express.json());

// Ruta al archivo db.json dentro de la carpeta data
const dbPath = path.join(__dirname, "data", "db.json");

// Ruta para obtener usuarios con filtros
app.get("/api/usuarios", (req, res) => {
  const { email, contraseña } = req.query;

  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer la base de datos:", err);
      return res.status(500).json({ error: "Error al leer la base de datos" });
    }
    try {
      const db = JSON.parse(data);

      // Filtra los usuarios si se proveen email y contraseña
      let usuarios = db.usuarios;
      if (email && contraseña) {
        usuarios = usuarios.filter(
          (user) => user.email === email && user.contraseña === contraseña
        );
      }

      res.json(usuarios);
    } catch (parseError) {
      console.error("Error al parsear el archivo JSON:", parseError);
      res.status(500).json({ error: "Error al procesar la base de datos" });
    }
  });
});
// Ruta para agregar una nueva lectura con todos los detalles
app.post("/api/lecturas", (req, res) => {
  const nuevaLectura = req.body;

  // Validar que se hayan proporcionado todos los campos requeridos
  if (
    !nuevaLectura.uso ||
    !nuevaLectura.tipo ||
    !nuevaLectura.linea ||
    !nuevaLectura.chasis ||
    !nuevaLectura.serie ||
    !nuevaLectura.color ||
    !nuevaLectura.placa ||
    !nuevaLectura.modelo ||
    !nuevaLectura.nombre ||
    !nuevaLectura.cui ||
    !nuevaLectura.nit ||
    !nuevaLectura.estado ||
    !nuevaLectura.fotoVehiculo ||
    !nuevaLectura.fotoConductor ||
    !nuevaLectura.ubicacion ||
    !nuevaLectura.fecha ||
    !nuevaLectura.hora
  ) {
    return res.status(400).json({ error: "Faltan datos requeridos." });
  }

  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer la base de datos:", err);
      return res.status(500).json({ error: "Error al leer la base de datos" });
    }

    try {
      const db = JSON.parse(data);
      db.lecturas = db.lecturas || []; // Asegúrate de que existe 'lecturas'

      // Aquí es donde debes generar el nuevo ID único
      const nuevaLecturaConId = {
        id: uuidv4(), // Generar un nuevo ID único
        ...nuevaLectura, // Usar el resto de los datos de la lectura
      };

      // Agregar la nueva lectura
      db.lecturas.push(nuevaLecturaConId);

      // Guardar las actualizaciones en db.json
      fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
        if (err) {
          console.error("Error al guardar la lectura:", err);
          return res.status(500).json({ error: "Error al guardar la lectura" });
        }
        console.log(nuevaLecturaConId);

        res.status(201).json(nuevaLecturaConId); // Responder con la nueva lectura
      });
    } catch (parseError) {
      console.error("Error al procesar la base de datos:", parseError);
      res.status(500).json({ error: "Error al procesar la base de datos" });
    }
  });
});

// Ruta para verificar si un correo electrónico ya existe en la base de datos
app.get("/api/check-email", (req, res) => {
  const { email } = req.query;

  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer la base de datos:", err);
      return res.status(500).json({ error: "Error al leer la base de datos" });
    }
    try {
      const db = JSON.parse(data);

      // Verificar si el correo existe en la base de datos
      const emailExists = db.usuarios.some((user) => user.email === email);

      // Responder con el resultado
      res.json({ exists: emailExists });
    } catch (parseError) {
      console.error("Error al parsear el archivo JSON:", parseError);
      res.status(500).json({ error: "Error al procesar la base de datos" });
    }
  });
});

// Configurar multer para almacenar las imágenes en la carpeta 'uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }
    cb(null, uploadsDir); // Asegúrate de que existe la carpeta 'uploads'
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Ruta para manejar la creación de reportes
app.post("/api/reportes", upload.single("photo"), (req, res) => {
  console.log(req.body); // Agregar esta línea para depuración
  const { placa, cui, estado } = req.body;
  const photo = req.file ? req.file.path : null;

  if (!placa || !cui || !estado || !photo) {
    return res.status(400).json({ error: "Faltan datos o foto" });
  }

  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer la base de datos:", err);
      return res.status(500).json({ error: "Error al leer la base de datos" });
    }

    try {
      const db = JSON.parse(data);

      if (!db.reportes) {
        db.reportes = [];
      }

      const newReport = {
        id: db.reportes.length + 1,
        placa,
        cui,
        estado,
        photo,
      };

      db.reportes.push(newReport);

      fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
        if (err) {
          console.error("Error al guardar el reporte:", err);
          return res.status(500).json({ error: "Error al guardar el reporte" });
        }
        res.status(201).json(newReport);
      });
    } catch (parseError) {
      console.error("Error al parsear el archivo JSON:", parseError);
      res.status(500).json({ error: "Error al procesar la base de datos" });
    }
  });
});

const { log } = require("console");
// Endpoint para agregar una nueva lectura con todos los detalles
app.post("/api/lecturas", (req, res) => {
  console.log(req.body); // Agregar esta línea para depuración

  // Extraer los datos del cuerpo de la solicitud
  const {
    uso,
    tipo,
    linea,
    chasis,
    serie,
    color,
    placa,
    modelo,
    nombre,
    cui,
    nit,
    estado,
    fotoVehiculo,
    fotoConductor,
    ubicacion,
    fecha,
    hora,
  } = req.body;

  // Validar que se hayan proporcionado todos los campos requeridos
  if (
    !uso ||
    !tipo ||
    !linea ||
    !chasis ||
    !serie ||
    !color ||
    !placa ||
    !modelo ||
    !nombre ||
    !cui ||
    !nit ||
    !estado ||
    !fotoVehiculo ||
    !fotoConductor ||
    !ubicacion ||
    !fecha ||
    !hora
  ) {
    return res.status(400).json({ error: "Faltan datos requeridos." });
  }

  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer la base de datos:", err);
      return res.status(500).json({ error: "Error al leer la base de datos" });
    }

    try {
      const db = JSON.parse(data);
      db.lecturas = db.lecturas || []; // Asegúrate de que existe 'lecturas'

      // Aquí es donde debes generar el nuevo ID único
      const nuevaLectura = {
        id: uuidv4(), // Generar un nuevo ID único
        uso,
        tipo,
        linea,
        chasis,
        serie,
        color,
        placa,
        modelo,
        nombre,
        cui,
        nit,
        estado,
        fotoVehiculo,
        fotoConductor,
        fecha,
        hora,
        ubicacion,
      };

      // Agregar la nueva lectura
      db.lecturas.push(nuevaLectura);

      // Guardar las actualizaciones en db.json
      fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
        if (err) {
          console.error("Error al guardar la lectura:", err);
          return res.status(500).json({ error: "Error al guardar la lectura" });
        }
        console.log(nuevaLectura);

        res.status(201).json(nuevaLectura); // Responder con la nueva lectura
      });
    } catch (parseError) {
      console.error("Error al procesar la base de datos:", parseError);
      res.status(500).json({ error: "Error al procesar la base de datos" });
    }
  });
});
// Ruta para obtener datos de rfid
app.get("/api/rfid", (req, res) => {
  const { placa } = req.query; // Obtener placa desde los parámetros de consulta

  // Validar que se haya proporcionado una placa
  if (!placa) {
    return res
      .status(400)
      .json({ message: "Se requiere el parámetro 'placa'." });
  }

  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer la base de datos:", err);
      return res.status(500).json({ error: "Error al leer la base de datos" });
    }

    try {
      const db = JSON.parse(data);

      // Buscar en la sección rfid
      const vehiculo = db.rfid.find((v) => v.placa === placa); // Buscar por placa

      // Verificar si se encontró el vehículo
      if (vehiculo) {
        res.json(vehiculo); // Devolver el vehículo encontrado
      } else {
        res.status(404).json({ message: "Vehículo no encontrado." }); // Mensaje de error si no se encuentra
      }
    } catch (parseError) {
      console.error("Error al parsear el archivo JSON:", parseError);
      res.status(500).json({ error: "Error al procesar la base de datos" });
    }
  });
});
// Endpoint para actualizar el estado del vehículo
app.put("/api/rfid/estado", (req, res) => {
  const { placa, estado } = req.body;

  if (!placa || !estado) {
    return res.status(400).json({ error: "Placa y estado son requeridos." });
  }

  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: ERROR_DB_READ });

    try {
      const db = JSON.parse(data);
      if (!db.rfid || !Array.isArray(db.rfid)) {
        return res.status(500).json({
          error: "La base de datos no contiene vehículos RFID válidos.",
        });
      }

      const vehiculo = db.rfid.find((v) => v.placa === placa);

      if (!vehiculo) {
        return res
          .status(404)
          .json({ success: false, message: ERROR_VEHICLE_NOT_FOUND });
      }

      vehiculo.estado = estado;

      fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
        if (err)
          return res.status(500).json({ error: "Error al guardar el estado." });

        res.json({ success: true, data: vehiculo });
      });
    } catch (parseError) {
      console.error("Error al procesar la base de datos:", parseError);
      res.status(500).json({ error: ERROR_DB_PARSE });
    }
  });
});
// Ruta para obtener todas las lecturas
app.get("/api/lecturas", (req, res) => {
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err)
      return res.status(500).json({ error: "Error al leer la base de datos." });

    try {
      const db = JSON.parse(data);
      const lecturas = db.lecturas || [];
      res.json(lecturas);
    } catch (parseError) {
      return res
        .status(500)
        .json({ error: "Error al procesar la base de datos." });
    }
  });
});
// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
