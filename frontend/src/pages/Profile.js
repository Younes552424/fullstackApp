import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../utils/api";

const AVATARS = [
  { id: "avatar1", char: "🧙‍♂️", label: "Mage" },
  { id: "avatar2", char: "🚀", label: "Voyageur" },
  { id: "avatar3", char: "🐱", label: "CyberCat" },
  { id: "avatar4", char: "🤖", label: "Androïde" },
];

function Profile() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("avatar1");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchProfile();
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      setFetching(true);
      const data = await api.get("/auth/profile");
      setName(data.name || "");
      setBio(data.bio || "");
      setSelectedAvatar(data.avatar || "avatar1");
    } catch (err) {
      setError("Impossible de récupérer les données du profil.");
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const updatedUser = await api.put("/auth/profile", {
        name,
        bio,
        avatar: selectedAvatar,
      });
      setSuccess("Profil mis à jour avec succès dans MongoDB !");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="page-container" style={loadingContainerStyle}>
        <div className="pulse-green"></div>
        <p style={{ marginTop: "15px", color: "var(--text-secondary)" }}>
          Chargement du profil...
        </p>
      </div>
    );
  }

  return (
    <div className="page-container" style={containerStyle}>
      {/* Decorative Atmosphere Elements */}
      <div className="bg-atmosphere">
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
      </div>

      <div className="glass-card scale-up" style={cardStyle}>
        <header style={headerStyle}>
          <h2 className="title-premium" style={titleStyle}>
            Édition Profil
          </h2>
          <p className="subtitle-premium">
            Personnalisez vos détails d'accès et votre identité système.
          </p>
        </header>

        {error && <div className="toast-msg toast-error">{error}</div>}
        {success && <div className="toast-msg toast-success">{success}</div>}

        <form onSubmit={handleSubmit} style={formStyle}>
          {/* Avatar Selector */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Choisissez votre avatar</label>
            <div style={avatarSelectorStyle}>
              {AVATARS.map((avatar) => (
                <button
                  key={avatar.id}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar.id)}
                  style={{
                    ...avatarBtnStyle,
                    borderColor:
                      selectedAvatar === avatar.id
                        ? "var(--accent-cyan)"
                        : "var(--border-color)",
                    backgroundColor:
                      selectedAvatar === avatar.id
                        ? "rgba(0, 240, 255, 0.1)"
                        : "rgba(255, 255, 255, 0.02)",
                  }}
                  title={avatar.label}
                >
                  <span style={{ fontSize: "2rem" }}>{avatar.char}</span>
                  <span style={avatarLabelStyle}>{avatar.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Name input */}
          <div style={inputGroupStyle}>
            <label htmlFor="name" style={labelStyle}>
              Nom complet
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="glass-input"
              placeholder="Ex: Younes"
            />
          </div>

          {/* Bio input */}
          <div style={inputGroupStyle}>
            <label htmlFor="bio" style={labelStyle}>
              Biographie / Rôle
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="glass-input"
              placeholder="Quelque chose sur vous..."
              rows="3"
              style={{ resize: "none" }}
            />
          </div>

          {/* Buttons */}
          <div style={btnGroupStyle}>
            <Link
              to="/dashboard"
              className="btn-premium btn-outline"
              style={{ textDecoration: "none", textAlign: "center", flex: 1 }}
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="btn-premium btn-cyan"
              style={{ flex: 1 }}
            >
              {loading ? "Enregistrement..." : "Sauvegarder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Styling Constants
const loadingContainerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
};

const containerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
};

const cardStyle = {
  width: "100%",
  maxWidth: "500px",
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
  gap: "25px",
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

const avatarSelectorStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "12px",
};

const avatarBtnStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
  padding: "12px 6px",
  borderRadius: "12px",
  cursor: "pointer",
  border: "1px solid",
  outline: "none",
};

const avatarLabelStyle = {
  fontSize: "0.7rem",
  color: "var(--text-secondary)",
  fontWeight: "500",
};

const btnGroupStyle = {
  display: "flex",
  gap: "15px",
  marginTop: "10px",
};

export default Profile;
