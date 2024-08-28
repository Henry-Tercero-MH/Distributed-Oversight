// routes/apiRoutes.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

// Ruta para autenticar al usuario
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const filePath = path.join(__dirname, "../db.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Error al leer los datos" });
    }

    const db = JSON.parse(data);
    const user = db.users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      res.json({ success: true });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Credenciales incorrectas" });
    }
  });
});

// Ruta para registrar un nuevo usuario
router.post("/users", (req, res) => {
  const newUser = req.body;

  const filePath = path.join(__dirname, "../db.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Error al leer los datos" });
    }

    const db = JSON.parse(data);
    db.users.push(newUser);

    fs.writeFile(filePath, JSON.stringify(db, null, 2), "utf8", (err) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: "Error al guardar los datos" });
      }
      res.json({ success: true });
    });
  });
});

// Rutas para lecturas RFID y reportes (deberás implementar estas según sea necesario)
router.post("/readings", (req, res) => {
  const newReading = req.body;

  const filePath = path.join(__dirname, "../db.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Error al leer los datos" });
    }

    const db = JSON.parse(data);
    db.readings.push(newReading);

    fs.writeFile(filePath, JSON.stringify(db, null, 2), "utf8", (err) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: "Error al guardar los datos" });
      }
      res.json({ success: true });
    });
  });
});

router.post("/rfid", (req, res) => {
  const newRfid = req.body;

  const filePath = path.join(__dirname, "../db.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Error al leer los datos" });
    }

    const db = JSON.parse(data);
    db.rfid.push(newRfid);

    fs.writeFile(filePath, JSON.stringify(db, null, 2), "utf8", (err) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: "Error al guardar los datos" });
      }
      res.json({ success: true });
    });
  });
});

router.post("/reports", (req, res) => {
  const newReport = req.body;

  const filePath = path.join(__dirname, "../db.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Error al leer los datos" });
    }

    const db = JSON.parse(data);
    db.reports.push(newReport);

    fs.writeFile(filePath, JSON.stringify(db, null, 2), "utf8", (err) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: "Error al guardar los datos" });
      }
      res.json({ success: true });
    });
  });
});

module.exports = router;
