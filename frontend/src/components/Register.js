import React, { useState } from "react";
import axios from "axios";

function Register({ onRegisterSuccess }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas");
      return;
    }

    if (formData.password.length < 6) {
      setMessage("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      setMessage("Inscription réussie ! Vous pouvez maintenant vous connecter.");
      
      // Réinitialiser le formulaire
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
      });

      // Appeler la fonction de callback si fournie
      if (onRegisterSuccess) {
        onRegisterSuccess();
      }

    } catch (error) {
      console.error("Erreur d'inscription :", error);
      setMessage(error.response?.data?.error || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Nom d'utilisateur:</label><br />
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Email:</label><br />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Mot de passe:</label><br />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Confirmer le mot de passe:</label><br />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: "100%", 
            padding: "10px", 
            backgroundColor: "#007bff", 
            color: "white", 
            border: "none", 
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Inscription..." : "S'inscrire"}
        </button>
      </form>

      {message && (
        <p style={{ 
          marginTop: "15px", 
          color: message.includes("réussie") ? "green" : "red",
          textAlign: "center"
        }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default Register;
