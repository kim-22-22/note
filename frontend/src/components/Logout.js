import React from "react";
import axios from "axios";

function Logout({ onLogout }) {
  const handleLogout = async () => {
    try {
      // Appeler l'endpoint de déconnexion
      await axios.post("http://localhost:5000/api/auth/logout");
      
      // Supprimer le token du localStorage
      localStorage.removeItem("token");
      
      // Appeler la fonction de callback
      if (onLogout) {
        onLogout();
      }
      
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
      // Supprimer le token même en cas d'erreur
      localStorage.removeItem("token");
      if (onLogout) {
        onLogout();
      }
    }
  };

  return (
    <button 
      onClick={handleLogout}
      style={{
        padding: "8px 16px",
        backgroundColor: "#dc3545",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer"
      }}
    >
      Se déconnecter
    </button>
  );
}

export default Logout;
