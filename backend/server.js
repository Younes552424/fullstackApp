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

// Connect to MongoDB using MONGO_URL from Railway
const mongoUri = process.env.MONGO_URL;
if (!mongoUri) {
    console.error("❌ MONGO_URL environment variable is not set. MongoDB connection will fail.");
    console.error("Available env vars:", Object.keys(process.env).filter(k => k.includes('MONGO')));
} else {
    console.log("✅ MONGO_URL is set, attempting connection...");
}

mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch((err) => console.error("❌ Erreur de connexion à MongoDB:", err.message));

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

app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});

