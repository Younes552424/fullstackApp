require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

// Serve compiled React frontend from the path produced by the Dockerfile:
// WORKDIR /app → frontend build lands at /app/frontend/build
const FRONTEND_BUILD = path.resolve("frontend/build");
app.use(express.static(FRONTEND_BUILD));

const PORT = process.env.PORT || 5000;

// Connect to MongoDB using MONGODB_URI (Railway) with MONGO_URI as a fallback
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!mongoUri) {
    console.error("❌ No MongoDB connection string found. Set the MONGODB_URI environment variable.");
    process.exit(1);
}
mongoose.connect(mongoUri)
.then(() => console.log("✅ Connecté à MongoDB"))
.catch((err) => console.error("❌ Erreur de connexion à MongoDB:", err));

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

// Catch-all: serve the React app for any non-API GET request (client-side routing)
app.use((req, res, next) => {
    if (req.method === 'GET') {
        res.sendFile(path.join(FRONTEND_BUILD, "index.html"));
    } else {
        next();
    }
});

app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});