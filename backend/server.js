require("dotenv").config();

// Import crypto module for MongoDB authentication
const crypto = require("crypto");

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

// Serve static files from frontend build
const frontendBuildPath = path.join(__dirname, "../frontend/build");
app.use(express.static(frontendBuildPath));

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
// Railway injecte automatiquement MONGODB_URL dans le conteneur.
// En local, définissez MONGO_URL dans backend/.env
// ⚠️ Aucun fallback localhost – on arrête le serveur proprement si aucune variable n'est définie.
const mongoUri =
  process.env.MONGODB_URL ||
  process.env.MONGO_URL ||
  process.env.MONGO_URI;

if (!mongoUri) {
  console.error('❌ Aucune variable de connexion MongoDB trouvée. Définissez MONGODB_URL dans Railway → Settings → Variables.');
  process.exit(1);
}

if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
  console.error('❌ Format invalide. La chaîne doit commencer par mongodb:// ou mongodb+srv://');
  console.error('❌ Valeur reçue :', mongoUri);
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => console.log('✅ Connecté à MongoDB'))
  .catch((err) => console.error('❌ Erreur de connexion à MongoDB:', err));

// API route for status check
app.get("/api/status", (req, res) => {
    const dbState = mongoose.connection.readyState;
    const status = {
        0: "Disconnected",
        1: "Connected",
        2: "Connecting",
        3: "Disconnecting",
    };
    res.json({
        api: "OK",
        database: status[dbState] || "Unknown"
    });
});

// Serve React app for all other GET requests (SPA fallback)
// Use middleware instead of route to avoid path-to-regexp issues
app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
        res.sendFile(path.join(frontendBuildPath, "index.html"), (err) => {
            if (err) {
                // If frontend build doesn't exist, return a simple message
                res.status(200).json({ message: "API is running. Frontend build not found." });
            }
        });
    } else {
        next();
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Serveur lancé sur http://0.0.0.0:${PORT}`);
    console.log(`✅ MongoDB URI utilisée: ${mongoUri.replace(/:([^@]+)@/, ':***@')}`);
});

