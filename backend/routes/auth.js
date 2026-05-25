const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "monsecretjwt";

// 1. POST /register - Sign Up
router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "L'email et le mot de passe sont requis." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Cet email est déjà enregistré." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      name: name || "Utilisateur",
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        bio: newUser.bio,
        avatar: newUser.avatar,
      },
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ error: "Erreur lors de la création du compte." });
  }
});

// 2. POST /login - Sign In
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "L'email et le mot de passe sont requis." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Identifiants invalides." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Identifiants invalides." });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        bio: user.bio,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Erreur lors de la connexion." });
  }
});

// 3. GET /profile - Get Protected Profile Data
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }
    res.json(user);
  } catch (err) {
    console.error("Get Profile Error:", err);
    res.status(500).json({ error: "Erreur lors de la récupération du profil." });
  }
});

// 4. PUT /profile - Update User Profile Information
router.put("/profile", auth, async (req, res) => {
  const { name, bio, avatar } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      bio: user.bio,
      avatar: user.avatar,
    });
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({ error: "Erreur lors de la mise à jour du profil." });
  }
});

// 5. POST /notes - Add a note
router.post("/notes", auth, async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Le titre et le contenu sont requis." });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    user.notes.push({ title, content });
    await user.save();

    res.status(201).json(user.notes);
  } catch (err) {
    console.error("Add Note Error:", err);
    res.status(500).json({ error: "Erreur lors de l'ajout de la note." });
  }
});

// 6. DELETE /notes/:id - Delete a note
router.delete("/notes/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    user.notes = user.notes.filter((note) => note._id.toString() !== req.params.id);
    await user.save();

    res.json(user.notes);
  } catch (err) {
    console.error("Delete Note Error:", err);
    res.status(500).json({ error: "Erreur lors de la suppression de la note." });
  }
});

// 7. DELETE /profile - Delete user account
router.delete("/profile", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }
    res.json({ message: "Compte utilisateur supprimé avec succès." });
  } catch (err) {
    console.error("Delete User Error:", err);
    res.status(500).json({ error: "Erreur lors de la suppression du compte." });
  }
});

module.exports = router;
