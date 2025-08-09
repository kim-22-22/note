import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Logout from "./components/Logout";

function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  // Vérifier si l'utilisateur est connecté au chargement
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const handleRegisterSuccess = () => {
    setShowRegister(false);
  };

  if (user) {
    return (
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
        <h1>Bienvenue, {user.username}!</h1>
        <p>Email: {user.email}</p>
        <Logout onLogout={handleLogout} />
        
        <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "5px" }}>
          <h3>Informations de connexion</h3>
          <p>Vous êtes maintenant connecté avec succès.</p>
          <p>Token: {localStorage.getItem("token")?.substring(0, 20)}...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>Système d'authentification</h1>
      
      {showRegister ? (
        <div>
          <Register onRegisterSuccess={handleRegisterSuccess} />
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            Déjà un compte ?{" "}
            <button 
              onClick={() => setShowRegister(false)}
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "#007bff",
                cursor: "pointer",
                textDecoration: "underline"
              }}
            >
              Se connecter
            </button>
          </p>
        </div>
      ) : (
        <div>
          <Login onLoginSuccess={handleLoginSuccess} />
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            Pas encore de compte ?{" "}
            <button 
              onClick={() => setShowRegister(true)}
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "#007bff",
                cursor: "pointer",
                textDecoration: "underline"
              }}
            >
              S'inscrire
            </button>
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
