const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2");
require("dotenv").config();

const router = express.Router();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// REGISTER
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // Validation simple
  if (!username || !email || !password) {
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }

  try {
    // Vérifier si l'utilisateur existe déjà
    const checkUserQuery = "SELECT * FROM users WHERE email = ?";
    db.query(checkUserQuery, [email], async (err, results) => {
      if (err) {
        console.error("Erreur MySQL :", err);
        return res.status(500).json({ error: "Erreur serveur" });
      }
      
      if (results.length > 0) {
        return res.status(409).json({ error: "Cet email est déjà utilisé" });
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insérer l'utilisateur
      const query = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
      db.query(query, [username, email, hashedPassword], (err, result) => {
        if (err) {
          console.error("Erreur MySQL lors de l'inscription :", err);
          return res.status(500).json({ error: "Erreur lors de l'inscription" });
        }
        
        res.status(201).json({ 
          message: "Utilisateur enregistré avec succès",
          userId: result.insertId 
        });
      });
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email et mot de passe requis" });
  }

  const query = "SELECT id, username, email, password FROM users WHERE email = ?";

  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error("Erreur MySQL :", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    const user = results[0];
    
    try {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Email ou mot de passe incorrect" });
      }

      const token = jwt.sign(
        { 
          id: user.id, 
          username: user.username, 
          email: user.email 
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: "24h" }
      );

      res.json({ 
        message: "Connexion réussie", 
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    } catch (error) {
      console.error("Erreur lors de la comparaison des mots de passe :", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });
});

// LOGOUT
router.post("/logout", (req, res) => {
  // Pour JWT, la déconnexion côté serveur consiste simplement à invalider le token côté client
  res.json({ message: "Déconnexion réussie" });
});

// GET USER INFO (route protégée)
router.get("/me", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ error: "Token manquant" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Token invalide" });
    }

    const query = "SELECT id, username, email FROM users WHERE id = ?";
    db.query(query, [decoded.id], (err, results) => {
      if (err || results.length === 0) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }

      res.json({ user: results[0] });
    });
  });
});

module.exports = router;
