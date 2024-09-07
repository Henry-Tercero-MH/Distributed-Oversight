const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
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

// Ruta para obtener lecturas
app.get("/api/lecturas", (req, res) => {
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer la base de datos:", err);
      return res.status(500).json({ error: "Error al leer la base de datos" });
    }
    try {
      const db = JSON.parse(data);
      res.json(db.lecturas);
    } catch (parseError) {
      console.error("Error al parsear el archivo JSON:", parseError);
      res.status(500).json({ error: "Error al procesar la base de datos" });
    }
  });
});

// Ruta para agregar una nueva lectura
app.post("/api/lecturas", (req, res) => {
  const newReading = req.body;

  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer la base de datos:", err);
      return res.status(500).json({ error: "Error al leer la base de datos" });
    }

    try {
      const db = JSON.parse(data);
      db.lecturas.push(newReading);

      fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
        if (err) {
          console.error("Error al guardar la lectura:", err);
          return res.status(500).json({ error: "Error al guardar la lectura" });
        }
        res.status(201).json(newReading);
      });
    } catch (parseError) {
      console.error("Error al parsear el archivo JSON:", parseError);
      res.status(500).json({ error: "Error al procesar la base de datos" });
    }
  });
});

// Ruta para obtener datos RFID
app.get("/api/rfid", (req, res) => {
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer la base de datos:", err);
      return res.status(500).json({ error: "Error al leer la base de datos" });
    }
    try {
      const db = JSON.parse(data);
      res.json(db.rfid);
    } catch (parseError) {
      console.error("Error al parsear el archivo JSON:", parseError);
      res.status(500).json({ error: "Error al procesar la base de datos" });
    }
  });
});

// Ruta para agregar datos RFID
app.post("/api/rfid", (req, res) => {
  const newRfid = req.body;

  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer la base de datos:", err);
      return res.status(500).json({ error: "Error al leer la base de datos" });
    }

    try {
      const db = JSON.parse(data);
      db.rfid.push(newRfid);

      fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
        if (err) {
          console.error("Error al guardar el dato RFID:", err);
          return res
            .status(500)
            .json({ error: "Error al guardar el dato RFID" });
        }
        res.status(201).json(newRfid);
      });
    } catch (parseError) {
      console.error("Error al parsear el archivo JSON:", parseError);
      res.status(500).json({ error: "Error al procesar la base de datos" });
    }
  });
});

// Ruta para verificar si un correo electrónico ya existe en la base de datos
app.get("/api/check-email", (req, res) => {
  const { email } = req.query;

  // Leer el archivo db.json
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

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
