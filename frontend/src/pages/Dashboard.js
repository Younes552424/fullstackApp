import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../utils/api";

const AVATAR_MAP = {
  avatar1: "🧙‍♂️",
  avatar2: "🚀",
  avatar3: "🐱",
  avatar4: "🤖",
};

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dbStatus, setDbStatus] = useState("Connecting...");
  const [notes, setNotes] = useState([]);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetchProfile();
    checkDatabaseStatus();
    const interval = setInterval(checkDatabaseStatus, 5000);
    return () => clearInterval(interval);
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      setLoadingProfile(true);
      const data = await api.get("/auth/profile");
      setUser(data);
      setNotes(data.notes || []);
    } catch (err) {
      setError("Session expirée. Veuillez vous reconnecter.");
      localStorage.removeItem("token");
      setTimeout(() => navigate("/login"), 1500);
    } finally {
      setLoadingProfile(false);
    }
  };

  const checkDatabaseStatus = async () => {
    try {
      const res = await fetch(
        window.location.port === "3000"
          ? "http://localhost:5000/api/status"
          : "/api/status"
      );
      const data = await res.json();
      setDbStatus(data.database);
    } catch (err) {
      setDbStatus("Disconnected");
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteTitle || !noteContent) return;
    setError("");
    setSuccess("");

    try {
      const updatedNotes = await api.post("/auth/notes", {
        title: noteTitle,
        content: noteContent,
      });
      setNotes(updatedNotes);
      setNoteTitle("");
      setNoteContent("");
      setSuccess("Note enregistrée dans MongoDB !");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      const updatedNotes = await api.delete(`/auth/notes/${id}`);
      setNotes(updatedNotes);
      setSuccess("Note supprimée de MongoDB !");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loadingProfile) {
    return (
      <div className="page-container" style={loadingContainerStyle}>
        <div className="pulse-green"></div>
        <p style={{ marginTop: "15px", color: "var(--text-secondary)" }}>
          Chargement du tableau de bord...
        </p>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Decorative Atmosphere Elements */}
      <div className="bg-atmosphere">
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
      </div>

      {/* Header Panel */}
      <header style={headerStyle}>
        <div>
          <span style={pillStyle}>PRO</span>
          <h1 className="title-premium" style={titleStyle}>
            Elysium Portal
          </h1>
          <p className="subtitle-premium">
            Bienvenue dans votre centre de contrôle full-stack,{" "}
            <strong>{user?.name}</strong>.
          </p>
        </div>
        <button onClick={handleLogout} className="btn-premium btn-danger">
          Déconnexion
        </button>
      </header>

      {error && <div className="toast-msg toast-error">{error}</div>}
      {success && <div className="toast-msg toast-success">{success}</div>}

      {/* Grid Dashboard */}
      <div style={gridStyle}>
        {/* Card 1: User Profile Context */}
        <div className="glass-card scale-up" style={cardSpan2Style}>
          <div style={profileHeaderStyle}>
            <div style={avatarStyle}>
              {AVATAR_MAP[user?.avatar] || "👤"}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={cardTitleStyle}>{user?.name}</h3>
              <p style={{ color: "var(--accent-cyan)", fontSize: "0.85rem", fontWeight: "600" }}>
                {user?.email}
              </p>
              <p style={bioStyle}>"{user?.bio}"</p>
            </div>
            <Link to="/profile" className="btn-premium btn-cyan" style={{ textDecoration: "none" }}>
              Éditer
            </Link>
          </div>
        </div>

        {/* Card 2: Database Live Telemetry */}
        <div className="glass-card scale-up">
          <h4 style={subCardTitleStyle}>Service Status</h4>
          <div style={statusGroupStyle}>
            <div style={statusItemStyle}>
              <span style={{ color: "var(--text-secondary)" }}>Base de données :</span>
              <div style={statusValueStyle}>
                <span
                  className={dbStatus === "Connected" ? "pulse-green" : "pulse-red"}
                  style={{ marginRight: "8px" }}
                ></span>
                <strong
                  style={{
                    color: dbStatus === "Connected" ? "var(--accent-green)" : "var(--accent-rose)",
                  }}
                >
                  {dbStatus}
                </strong>
              </div>
            </div>
            <div style={statusItemStyle}>
              <span style={{ color: "var(--text-secondary)" }}>Temps de réponse API :</span>
              <strong style={{ color: "var(--accent-cyan)" }}>4 ms</strong>
            </div>
            <div style={statusItemStyle}>
              <span style={{ color: "var(--text-secondary)" }}>Stabilité système :</span>
              <strong style={{ color: "var(--text-primary)" }}>99.9%</strong>
            </div>
          </div>
        </div>

        {/* Card 3: Quick Notes CRUD Manager */}
        <div className="glass-card scale-up" style={cardSpan2Style}>
          <h3 className="title-premium" style={cardTitleStyle}>
            Base MongoDB : Notes & Tâches
          </h3>
          <p className="subtitle-premium" style={{ marginBottom: "20px" }}>
            Ajoutez ou supprimez des notes directement dans votre document utilisateur en base de données.
          </p>

          <form onSubmit={handleAddNote} style={noteFormStyle}>
            <input
              type="text"
              placeholder="Titre de la note"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              className="glass-input"
              required
              style={{ flex: 1 }}
            />
            <input
              type="text"
              placeholder="Description ou contenu"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="glass-input"
              required
              style={{ flex: 2 }}
            />
            <button type="submit" className="btn-premium btn-green">
              Enregistrer
            </button>
          </form>

          <div style={notesGridStyle}>
            {notes.length === 0 ? (
              <div style={emptyNotesStyle}>
                <p>Aucune note enregistrée pour le moment.</p>
                <small style={{ color: "var(--text-muted)" }}>
                  Utilisez le formulaire ci-dessus pour stocker vos notes dans MongoDB.
                </small>
              </div>
            ) : (
              notes.map((note) => (
                <div key={note._id} className="glass-card" style={noteCardStyle}>
                  <div style={noteHeaderStyle}>
                    <h5 style={noteTitleStyle}>{note.title}</h5>
                    <button
                      onClick={() => handleDeleteNote(note._id)}
                      style={deleteBtnStyle}
                      title="Supprimer la note de MongoDB"
                    >
                      ✕
                    </button>
                  </div>
                  <p style={noteContentStyle}>{note.content}</p>
                  <small style={noteDateStyle}>
                    {new Date(note.createdAt).toLocaleDateString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </small>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Card 4: Progress telemetry */}
        <div className="glass-card scale-up">
          <h4 style={subCardTitleStyle}>Complétude du Profil</h4>
          <div style={progressBarContainerStyle}>
            <div
              style={{
                ...progressBarFillStyle,
                width: user?.bio && user?.name !== "Utilisateur" ? "100%" : "60%",
              }}
            ></div>
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "10px" }}>
            {user?.bio && user?.name !== "Utilisateur"
              ? "Profil entièrement complété ! 🚀"
              : "Complétez votre profil en modifiant votre nom et bio dans les options."}
          </p>
        </div>
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

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "40px",
  gap: "20px",
  flexWrap: "wrap",
};

const pillStyle = {
  display: "inline-block",
  background: "linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-purple) 100%)",
  color: "#050b14",
  fontSize: "0.7rem",
  fontWeight: "800",
  padding: "3px 8px",
  borderRadius: "100px",
  marginBottom: "10px",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const titleStyle = {
  fontSize: "2.5rem",
  marginBottom: "8px",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "25px",
};

const cardSpan2Style = {
  gridColumn: "span 1",
  "@media (min-width: 900px)": {
    gridColumn: "span 2",
  },
};

const cardTitleStyle = {
  fontSize: "1.4rem",
  marginBottom: "15px",
  fontFamily: "var(--font-family-title)",
};

const subCardTitleStyle = {
  fontSize: "1.05rem",
  fontWeight: "700",
  marginBottom: "18px",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "var(--text-secondary)",
};

const profileHeaderStyle = {
  display: "flex",
  alignItems: "center",
  gap: "25px",
  flexWrap: "wrap",
};

const avatarStyle = {
  fontSize: "3.5rem",
  background: "rgba(255, 255, 255, 0.05)",
  width: "80px",
  height: "80px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "2px solid var(--border-color)",
};

const bioStyle = {
  marginTop: "10px",
  fontStyle: "italic",
  color: "var(--text-secondary)",
  fontSize: "0.95rem",
};

const statusGroupStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

const statusItemStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingBottom: "10px",
  borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
};

const statusValueStyle = {
  display: "flex",
  alignItems: "center",
};

const noteFormStyle = {
  display: "flex",
  gap: "15px",
  marginBottom: "25px",
  flexWrap: "wrap",
};

const notesGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
  gap: "15px",
};

const emptyNotesStyle = {
  gridColumn: "1 / -1",
  textAlign: "center",
  padding: "40px 20px",
  background: "rgba(255, 255, 255, 0.02)",
  borderRadius: "12px",
  border: "1px dashed var(--border-color)",
  color: "var(--text-secondary)",
};

const noteCardStyle = {
  padding: "18px",
  background: "rgba(255, 255, 255, 0.02)",
  borderColor: "rgba(255, 255, 255, 0.04)",
  borderRadius: "12px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  minHeight: "150px",
};

const noteHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "10px",
  marginBottom: "8px",
};

const noteTitleStyle = {
  fontSize: "1.05rem",
  fontWeight: "700",
  color: "var(--accent-cyan)",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const deleteBtnStyle = {
  background: "transparent",
  border: "none",
  color: "var(--text-muted)",
  cursor: "pointer",
  fontSize: "0.85rem",
  padding: "2px 6px",
  borderRadius: "4px",
};

const noteContentStyle = {
  fontSize: "0.9rem",
  lineHeight: "1.4",
  color: "var(--text-secondary)",
  marginBottom: "12px",
  flex: 1,
};

const noteDateStyle = {
  fontSize: "0.75rem",
  color: "var(--text-muted)",
};

const progressBarContainerStyle = {
  height: "8px",
  width: "100%",
  background: "rgba(255, 255, 255, 0.05)",
  borderRadius: "100px",
  overflow: "hidden",
  marginTop: "15px",
};

const progressBarFillStyle = {
  height: "100%",
  background: "linear-gradient(90deg, var(--accent-cyan) 0%, var(--accent-green) 100%)",
  borderRadius: "100px",
  transition: "width 0.8s cubic-bezier(0.1, 0.8, 0.2, 1)",
};

export default Dashboard;
