const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Import des routes
const authRoutes = require("./routes/auth");
const privateRoutes = require("./routes/private");

// Utilisation des routes
app.use("/api/auth", authRoutes);
app.use("/api/private", privateRoutes);

app.listen(5000, () => {
  console.log("Serveur backend démarré sur http://localhost:5000");
});
