const express = require("express");
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

const app = express();
const PORT = 3000;

app.use(express.static(__dirname));
app.use(express.json());

// Servir index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Guardar encuesta en Excel
app.post("/guardar", (req, res) => {
  const data = req.body;
  const filePath = path.join(__dirname, "encuestas.xlsx");

  let workbook;
  let worksheet;
  let existingData = [];

  if (fs.existsSync(filePath)) {
    workbook = XLSX.readFile(filePath);
    worksheet = workbook.Sheets[workbook.SheetNames[0]];
    existingData = XLSX.utils.sheet_to_json(worksheet);
  } else {
    workbook = XLSX.utils.book_new();
  }

  // Construir objeto con todas las preguntas como columnas
  let row = {
    Nombre: data.nombre,
    Teléfono: data.telefono,
    Correo: data.correo,
    Servicio: data.servicio,
  };

 data.respuestas.forEach((resp, index) => {
  const preguntaTexto = data.preguntas[index]; // agregaremos este arreglo desde el front
  row[preguntaTexto] = resp;
});

  row["Comentarios"] = data.comentarios;

  existingData.push(row);

  const newSheet = XLSX.utils.json_to_sheet(existingData);
  XLSX.utils.book_append_sheet(workbook, newSheet, "Encuestas");
  XLSX.writeFile(workbook, filePath);

  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:3000`);
});
