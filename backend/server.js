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
app.use(express.static(path.join(__dirname, "../frontend/build")));

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
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

app.use((req, res, next) => {
    if (req.method === 'GET') {
        res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
    } else {
        next();
    }
});

app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});