import React, { useState } from "react";
import axios from "axios";

function Login({ onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
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
    setLoading(true);

    if (!formData.email || !formData.password) {
      setMessage("Email et mot de passe requis");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email: formData.email,
        password: formData.password
      });

      const { token, user } = response.data;
      
      // Sauvegarder le token et les infos utilisateur
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      setMessage("Connexion réussie !");
      
      // Appeler la fonction de callback
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }

    } catch (error) {
      console.error("Erreur de connexion :", error);
      setMessage(error.response?.data?.error || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit}>
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

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: "100%", 
            padding: "10px", 
            backgroundColor: "#28a745", 
            color: "white", 
            border: "none", 
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Connexion..." : "Se connecter"}
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

export default Login;
