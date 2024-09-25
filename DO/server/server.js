const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const multer = require("multer"); // Asegúrate de haber instalado multer
const app = express();
const port = 3001;

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

// Ruta para agregar un nuevo usuario
app.post("/api/usuarios", (req, res) => {
  const newUser = req.body;

  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer la base de datos:", err);
      return res.status(500).json({ error: "Error al leer la base de datos" });
    }

    try {
      const db = JSON.parse(data);
      db.usuarios.push(newUser);

      fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
        if (err) {
          console.error("Error al guardar el usuario:", err);
          return res.status(500).json({ error: "Error al guardar el usuario" });
        }
        res.status(201).json(newUser);
      });
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

// Endpoint para agregar una nueva lectura
app.post("/api/lecturas", (req, res) => {
  const nuevaLectura = req.body;

  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error al leer la base de datos" });
    }

    try {
      const db = JSON.parse(data);
      nuevaLectura.id = db.lecturas.length + 1; // Asignar un nuevo ID

      db.lecturas.push(nuevaLectura); // Agregar la nueva lectura

      fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
        if (err) {
          return res.status(500).json({ error: "Error al guardar la lectura" });
        }
        res.status(201).json(nuevaLectura); // Responder con la nueva lectura
      });
    } catch (parseError) {
      return res
        .status(500)
        .json({ error: "Error al procesar la base de datos" });
    }
  });
});

app.get("/api/lecturas/:placa", (req, res) => {
  const placa = req.params.placa;

  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error al leer la base de datos" });
    }

    const db = JSON.parse(data);
    const lecturasFiltradas = db.lecturas.filter(
      (lectura) => lectura.placa === placa
    );

    res.status(200).json(lecturasFiltradas);
  });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
