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
// Guardar encuesta en Excel
// Guardar encuesta en Excel
// Guardar encuesta en Excel
app.post("/guardar", (req, res) => {
  const data = req.body;
  const filePath = path.join(__dirname, "encuestas.xlsx");

  let workbook;
  let existingData = [];

  // Abrimos o creamos libro
  if (fs.existsSync(filePath)) {
    workbook = XLSX.readFile(filePath);
    const worksheet = workbook.Sheets["Encuestas"];
    if (worksheet) {
      existingData = XLSX.utils.sheet_to_json(worksheet);
    }
  } else {
    workbook = XLSX.utils.book_new();
  }

  // Construir fila de la encuesta
  const row = {
    Nombre: data.nombre,
    Teléfono: data.telefono,
    Correo: data.correo,
    Servicio: data.servicio,
  };

  data.respuestas.forEach((resp, index) => {
    const preguntaTexto = data.preguntas[index];
    row[preguntaTexto] = resp;
  });

  row["Comentarios"] = data.comentarios;

  // Añadir fila a los datos existentes
  existingData.push(row);

  // Crear hoja nueva
  const newSheet = XLSX.utils.json_to_sheet(existingData);

  // Reemplazar hoja existente o agregar nueva
  if (workbook.SheetNames.includes("Encuestas")) {
    workbook.Sheets["Encuestas"] = newSheet; // reemplaza la hoja
  } else {
    XLSX.utils.book_append_sheet(workbook, newSheet, "Encuestas");
  }

  // Guardar archivo
  XLSX.writeFile(workbook, filePath);

  res.json({ ok: true });
});



// Ruta para descargar el archivo Excel
app.get("/download", (req, res) => {
  const token = req.query.token || "";

  // Define un token de descarga (lo mejor es ponerlo en variables de entorno en Render)
  const DOWNLOAD_TOKEN = process.env.DOWNLOAD_TOKEN || "saquina2025";

  if (token !== DOWNLOAD_TOKEN) {
    return res.status(403).send("Forbidden: token inválido");
  }

  const filePath = path.join(__dirname, "encuestas.xlsx");

  if (fs.existsSync(filePath)) {
    return res.download(filePath, "encuestas.xlsx");
  } else {
    return res.status(404).send("No existe encuestas.xlsx todavía.");
  }
});



app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:3000`);
});
