const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());


const filePath = path.join(__dirname, "newsletter.txt");

app.post("/newsletter", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Falta de correo electrónico!" });
  }

  console.log(`📩 Nueva suscripción al newsletter: ${email}`);

  try {
    fs.appendFileSync(filePath, `${email}\n`);
  } catch (error) {
    console.error("❌ Error al guardar:", error);
    return res.status(500).json({ message: "Error de escritura!" });
  }

  res.json({ message: `¡Gracias! ${email} ha sido añadido a la lista de newsletter.` });
});

app.listen(PORT, () => {
  console.log(`✅ El backend funciona en http://localhost:${PORT}`);
  console.log(`📁 Guardar correos electrónicos en: ${filePath}`);
});
