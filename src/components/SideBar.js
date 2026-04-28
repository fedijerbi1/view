import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const THEMES = {
  primary: { base: "#2E86C1", dark: "#1A5276", light: "#D6EAF8" },
  success: { base: "#27AE60", dark: "#1E8449", light: "#DFF5E6" },
  info: { base: "#3B9DDB", dark: "#1A5276", light: "#D6EAF8" },
};

export default function SideBar({ title, subtitle, items, accent = "primary" }) {
  const navigate = useNavigate();
  const theme = THEMES[accent] || THEMES.primary;

  const handleLogout = () => {
    Swal.fire({
      title: "Déconnexion",
      text: "Êtes-vous sûr de vouloir vous déconnecter ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, déconnecter",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        navigate("/");
        Swal.fire("Déconnecté", "Vous avez été déconnecté avec succès.", "success");
      }
    });
  };

  return (
    <aside style={{
      width: 260,
      background: `linear-gradient(180deg, ${theme.dark} 0%, ${theme.base} 65%, ${theme.base} 100%)`,
      color: "#fff",
      padding: "26px 18px",
      display: "flex",
      flexDirection: "column",
      gap: 20,
      position: "sticky",
      top: 0,
      height: "100vh",
      boxShadow: "2px 0 18px rgba(0,0,0,0.08)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 14, background: theme.light, display: "flex", alignItems: "center", justifyContent: "center", color: theme.dark, fontWeight: 700 }}>
          🏥
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{title}</div>
          <div style={{ fontSize: 11, opacity: 0.8 }}>{subtitle}</div>
        </div>
      </div>

      <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 12, padding: "10px 12px", fontSize: 12 }}>
        Acces securise
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, overflowY: "auto", paddingRight: 6 }}>
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              textDecoration: "none",
              color: isActive ? theme.dark : "#EAF2F8",
              background: isActive ? "#FFFFFF" : "transparent",
              padding: "10px 12px",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontWeight: isActive ? 700 : 500,
              boxShadow: isActive ? "0 10px 24px rgba(0,0,0,0.12)" : "none",
            })}
          >
            <span style={{ fontSize: 16 }}>{item.icon || "•"}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button onClick={handleLogout} style={{
        background: "rgba(255,255,255,0.2)",
        border: "1px solid rgba(255,255,255,0.35)",
        color: "#fff",
        padding: "10px 12px",
        borderRadius: 12,
        cursor: "pointer",
        fontWeight: 600,
      }}>
        Se deconnecter
      </button>
    </aside>
  );
}