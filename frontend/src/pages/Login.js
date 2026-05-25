import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";

function Login() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Clear session when loading login page
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isRegister) {
        // Sign Up Flow
        const data = await api.post("/auth/register", { email, password, name });
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setSuccess("Compte créé avec succès !");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        // Sign In Flow
        const data = await api.post("/auth/login", { email, password });
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setSuccess("Connexion réussie...");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={containerStyle}>
      {/* Decorative Atmosphere Elements */}
      <div className="bg-atmosphere">
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
      </div>

      <div className="glass-card scale-up" style={cardStyle}>
        <div style={headerStyle}>
          <div className="pulse-green" style={{ marginBottom: "15px" }}></div>
          <h2 className="title-premium" style={titleStyle}>
            {isRegister ? "Elysium Register" : "Elysium Login"}
          </h2>
          <p className="subtitle-premium">
            {isRegister
              ? "Rejoignez le tableau de bord nouvelle génération."
              : "Connectez-vous pour piloter vos données."}
          </p>
        </div>

        {error && <div className="toast-msg toast-error">{error}</div>}
        {success && <div className="toast-msg toast-success">{success}</div>}

        <form onSubmit={handleSubmit} style={formStyle}>
          {isRegister && (
            <div style={inputGroupStyle}>
              <label htmlFor="name" style={labelStyle}>
                Nom complet
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre nom"
                required
                className="glass-input"
              />
            </div>
          )}

          <div style={inputGroupStyle}>
            <label htmlFor="email" style={labelStyle}>
              Adresse Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="adresse@mail.com"
              required
              className="glass-input"
            />
          </div>

          <div style={inputGroupStyle}>
            <label htmlFor="password" style={labelStyle}>
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="glass-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-premium btn-cyan"
            style={buttonStyle}
          >
            {loading
              ? "Traitement..."
              : isRegister
              ? "Créer un compte"
              : "Se connecter"}
          </button>
        </form>

        <div style={footerStyle}>
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
              setSuccess("");
            }}
            className="btn-premium btn-outline"
            style={{ width: "100%", fontSize: "0.85rem", padding: "10px" }}
          >
            {isRegister
              ? "Déjà membre ? Se connecter"
              : "Nouveau ici ? Créer un compte"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Styling Constants
const containerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
};

const cardStyle = {
  width: "100%",
  maxWidth: "420px",
  padding: "40px",
};

const headerStyle = {
  textAlign: "center",
  marginBottom: "30px",
};

const titleStyle = {
  fontSize: "2rem",
  marginBottom: "10px",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const inputGroupStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const labelStyle = {
  fontSize: "0.8rem",
  fontWeight: "600",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "var(--text-secondary)",
};

const buttonStyle = {
  marginTop: "10px",
  width: "100%",
};

const footerStyle = {
  marginTop: "25px",
  textAlign: "center",
};

export default Login;
