const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "../data/db.json");

// Leer el archivo `db.json`
function readDb() {
  return JSON.parse(fs.readFileSync(dbPath, "utf-8"));
}

// Escribir en el archivo `db.json`
function writeDb(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// Rutas para usuarios

// Obtener todos los usuarios
router.get("/usuarios", (req, res) => {
  const db = readDb();
  res.json(db.usuarios);
});

// Obtener usuario por ID
router.get("/usuarios/:id", (req, res) => {
  const db = readDb();
  const usuario = db.usuarios.find((u) => u.id === parseInt(req.params.id));
  if (usuario) {
    res.json(usuario);
  } else {
    res.status(404).json({ message: "Usuario no encontrado" });
  }
});

// Crear nuevo usuario
router.post("/usuarios", (req, res) => {
  const db = readDb();
  const nuevoUsuario = req.body;
  nuevoUsuario.id = db.usuarios.length + 1;
  db.usuarios.push(nuevoUsuario);
  writeDb(db);
  res.status(201).json(nuevoUsuario);
});

// Editar usuario existente
router.put("/usuarios/:id", (req, res) => {
  const db = readDb();
  const index = db.usuarios.findIndex((u) => u.id === parseInt(req.params.id));
  if (index !== -1) {
    db.usuarios[index] = { ...db.usuarios[index], ...req.body };
    writeDb(db);
    res.json(db.usuarios[index]);
  } else {
    res.status(404).json({ message: "Usuario no encontrado" });
  }
});

// Eliminar usuario
router.delete("/usuarios/:id", (req, res) => {
  const db = readDb();
  const index = db.usuarios.findIndex((u) => u.id === parseInt(req.params.id));
  if (index !== -1) {
    const eliminado = db.usuarios.splice(index, 1);
    writeDb(db);
    res.json(eliminado);
  } else {
    res.status(404).json({ message: "Usuario no encontrado" });
  }
});

// Rutas para lecturas RFID

// Obtener todas las lecturas RFID
router.get("/lecturas", (req, res) => {
  const db = readDb();
  res.json(db.lecturas);
});

// Crear nueva lectura RFID
router.post("/lecturas", (req, res) => {
  const db = readDb();
  const nuevaLectura = req.body;
  nuevaLectura.id = db.lecturas.length + 1;
  db.lecturas.push(nuevaLectura);
  writeDb(db);
  res.status(201).json(nuevaLectura);
});

// Rutas para reportes

// Obtener todos los reportes
router.get("/reportes", (req, res) => {
  const db = readDb();
  res.json(db.reportes);
});

// Crear nuevo reporte
router.post("/reportes", (req, res) => {
  const db = readDb();
  const nuevoReporte = req.body;
  nuevoReporte.id = db.reportes.length + 1;
  db.reportes.push(nuevoReporte);
  writeDb(db);
  res.status(201).json(nuevoReporte);
});

module.exports = router;
