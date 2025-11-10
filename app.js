const express = require("express");
require("dotenv").config();
const path = require("path");
const cors = require("cors");
const initDatabase = require("./config/init");

const app = express();
const PORT = process.env.PORT;

initDatabase();

app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use((req, res, next) => {
  const contentType = req.headers["content-type"] || "";
  if (contentType.startsWith("multipart/form-data")) {
    return next();
  }
  express.json()(req, res, next);
});

app.use(express.urlencoded({ extended: true }));


app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const authRoutes = require("./routes/auth");
const plantesRoutes = require("./routes/plantes");

app.use("/api/auth", authRoutes);
app.use("/api/plantes", plantesRoutes);


app.get("/", (req, res) => {
  res.json({ message: " API Arroso'Moi fonctionne parfaitement !" });
});


app.use((err, req, res, next) => {
  console.error("Erreur non interceptée :", err);
  res.status(500).json({
    success: false,
    message: "Erreur serveur interne.",
    error: err.message
  });
});


app.listen(PORT, () => {
  console.log(` Serveur lancé sur http://localhost:${PORT}`);
});
