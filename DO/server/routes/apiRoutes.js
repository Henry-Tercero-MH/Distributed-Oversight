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
  res.json({ success: true, data: db.usuarios });
});

// Obtener usuario por ID
router.get("/usuarios/:id", (req, res) => {
  const db = readDb();
  const usuario = db.usuarios.find((u) => u.id === parseInt(req.params.id));
  if (usuario) {
    res.json({ success: true, data: usuario });
  } else {
    res.status(404).json({ success: false, message: "Usuario no encontrado" });
  }
});

// Crear nuevo usuario
router.post("/usuarios", (req, res) => {
  const db = readDb();
  const nuevoUsuario = req.body;
  nuevoUsuario.id =
    db.usuarios.length > 0 ? Math.max(...db.usuarios.map((u) => u.id)) + 1 : 1;
  db.usuarios.push(nuevoUsuario);
  writeDb(db);
  res.status(201).json({ success: true, data: nuevoUsuario });
});

// Editar usuario existente
router.put("/usuarios/:id", (req, res) => {
  const db = readDb();
  const index = db.usuarios.findIndex((u) => u.id === parseInt(req.params.id));
  if (index !== -1) {
    db.usuarios[index] = { ...db.usuarios[index], ...req.body };
    writeDb(db);
    res.json({ success: true, data: db.usuarios[index] });
  } else {
    res.status(404).json({ success: false, message: "Usuario no encontrado" });
  }
});

// Eliminar usuario
router.delete("/usuarios/:id", (req, res) => {
  const db = readDb();
  const index = db.usuarios.findIndex((u) => u.id === parseInt(req.params.id));
  if (index !== -1) {
    const eliminado = db.usuarios.splice(index, 1);
    writeDb(db);
    res.json({ success: true, data: eliminado });
  } else {
    res.status(404).json({ success: false, message: "Usuario no encontrado" });
  }
});

// Rutas para lecturas RFID

// Obtener todas las lecturas RFID
router.get("/lecturas", (req, res) => {
  const db = readDb();
  res.json({ success: true, data: db.lecturas });
});

// Crear nueva lectura RFID y generar un reporte
router.post("/lecturas", (req, res) => {
  try {
    const db = readDb();
    const nuevaLectura = req.body;

    // Validar que se proporcione la placa
    if (
      !nuevaLectura.placa ||
      !nuevaLectura.ubicacion ||
      !nuevaLectura.fecha ||
      !nuevaLectura.hora
    ) {
      return res.status(400).json({
        success: false,
        message: "Se requieren 'placa', 'ubicacion', 'fecha' y 'hora'.",
      });
    }

    // Buscar el vehículo según la placa en el archivo `db.json`
    const vehiculo = db.vehiculos.find((v) => v.placa === nuevaLectura.placa);

    if (!vehiculo) {
      return res
        .status(404)
        .json({ success: false, message: "Vehículo no encontrado." });
    }

    // Generar la nueva lectura RFID
    nuevaLectura.id =
      db.lecturas.length > 0
        ? Math.max(...db.lecturas.map((l) => l.id)) + 1
        : 1;
    db.lecturas.push(nuevaLectura);

    // Crear un nuevo reporte automáticamente con los nuevos datos
    const nuevoReporte = {
      id:
        db.reportes.length > 0
          ? Math.max(...db.reportes.map((r) => r.id)) + 1
          : 1,
      conductor: vehiculo.conductor || "Desconocido",
      placa: vehiculo.placa,
      tipo: vehiculo.tipo,
      uso: vehiculo.uso,
      ubicacion: nuevaLectura.ubicacion,
      fecha: nuevaLectura.fecha,
      hora: nuevaLectura.hora,
      detalle: `Lectura RFID para el vehículo con placa ${vehiculo.placa} registrada en la ubicación ${nuevaLectura.ubicacion}.`,
    };

    // Agregar el nuevo reporte a la base de datos
    db.reportes.push(nuevoReporte);

    // Guardar los cambios en el archivo `db.json`
    writeDb(db);

    // Devolver la respuesta con la nueva lectura y el reporte generado
    res.status(201).json({
      success: true,
      mensaje: "Lectura y reporte creados exitosamente.",
      lectura: nuevaLectura,
      reporte: nuevoReporte,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error al crear la lectura RFID." });
  }
});

// Rutas para reportes

// Obtener todos los reportes
router.get("/reportes", (req, res) => {
  const db = readDb();
  res.json({ success: true, data: db.reportes });
});

// Crear nuevo reporte
router.post("/reportes", (req, res) => {
  const db = readDb();
  const nuevoReporte = req.body;
  nuevoReporte.id =
    db.reportes.length > 0 ? Math.max(...db.reportes.map((r) => r.id)) + 1 : 1;
  db.reportes.push(nuevoReporte);
  writeDb(db);
  res.status(201).json({ success: true, data: nuevoReporte });
});

// Obtener vehículo por placa (con parámetros de consulta)
router.get("/rfid", (req, res) => {
  const { placa } = req.query; // Obtener placa desde los parámetros de consulta

  // Validar que se haya proporcionado una placa
  if (!placa) {
    return res
      .status(400)
      .json({ success: false, message: "Se requiere el parámetro 'placa'." });
  }

  try {
    const db = readDb(); // Asumiendo que readDb() lee tu archivo JSON

    // Buscar en la sección rfid
    const vehiculo = db.rfid.find((v) => v.placa === placa); // Buscar por placa

    // Verificar si se encontró el vehículo
    if (vehiculo) {
      res.status(200).json({ success: true, data: vehiculo }); // Devolver el vehículo encontrado
    } else {
      res
        .status(404)
        .json({ success: false, message: "Vehículo no encontrado." }); // Mensaje de error si no se encuentra
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error al obtener el vehículo." });
  }
});

// Actualizar el estado del vehículo
router.put("/rfid/estado", (req, res) => {
  const { placa, estado } = req.body; // Obtener la placa y el estado desde el cuerpo de la solicitud

  if (!placa || !estado) {
    return res
      .status(400)
      .json({ success: false, message: "Placa y estado son requeridos." });
  }

  try {
    const db = readDb();

    // Buscar el vehículo según la placa en la sección `rfid`
    const vehiculo = db.rfid.find((v) => v.placa === placa);

    if (!vehiculo) {
      return res
        .status(404)
        .json({ success: false, message: "Vehículo no encontrado." });
    }

    // Actualizar el estado del vehículo
    vehiculo.estado = estado;

    // Guardar los cambios en el archivo `db.json`
    writeDb(db);

    // Devolver el vehículo actualizado
    res.json({ success: true, data: vehiculo });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error al actualizar el estado." });
  }
});

module.exports = router;
