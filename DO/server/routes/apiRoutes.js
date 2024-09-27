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

// Crear nueva lectura RFID y generar un reporte
router.post("/lecturas", (req, res) => {
  const db = readDb();
  const nuevaLectura = req.body;

  // Buscar el vehículo según la placa en el archivo `db.json`
  const vehiculo = db.vehiculos.find((v) => v.placa === nuevaLectura.placa);

  if (!vehiculo) {
    return res.status(404).json({ message: "Vehículo no encontrado" });
  }

  // Generar la nueva lectura RFID
  nuevaLectura.id = db.lecturas.length + 1;
  db.lecturas.push(nuevaLectura);

  // Crear un nuevo reporte automáticamente con los nuevos datos
  const nuevoReporte = {
    id: db.reportes.length + 1,
    conductor: vehiculo.conductor || "Desconocido", // Asegúrate de que el campo exista
    placa: vehiculo.placa,
    tipo: vehiculo.tipo,
    uso: vehiculo.uso,
    ubicacion: nuevaLectura.ubicacion, // Nueva ubicación de la lectura
    fecha: nuevaLectura.fecha, // Fecha de la lectura
    hora: nuevaLectura.hora, // Hora de la lectura
    detalle: `Lectura RFID para el vehículo con placa ${vehiculo.placa} registrada en la ubicación ${nuevaLectura.ubicacion}.`,
  };

  // Agregar el nuevo reporte a la base de datos
  db.reportes.push(nuevoReporte);

  // Guardar los cambios en el archivo `db.json`
  writeDb(db);

  // Devolver la respuesta con la nueva lectura y el reporte generado
  res.status(201).json({
    mensaje: "Lectura y reporte creados exitosamente",
    lectura: nuevaLectura,
    reporte: nuevoReporte,
  });
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
// Obtener vehículo por placa (con parámetros de consulta)
router.get("/rfid", (req, res) => {
  const { placa } = req.query; // Obtener placa desde los parámetros de consulta

  // Validar que se haya proporcionado una placa
  if (!placa) {
    return res
      .status(400)
      .json({ message: "Se requiere el parámetro 'placa'." });
  }

  const db = readDb(); // Asumiendo que readDb() lee tu archivo JSON

  // Buscar en la sección rfid
  const vehiculo = db.rfid.find((v) => v.placa === placa); // Buscar por placa

  // Verificar si se encontró el vehículo
  if (vehiculo) {
    res.json(vehiculo); // Devolver el vehículo encontrado
  } else {
    res.status(404).json({ message: "Vehículo no encontrado." }); // Mensaje de error si no se encuentra
  }
});

module.exports = router;
