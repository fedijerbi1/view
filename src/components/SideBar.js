import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { C, THEMES, SHADOWS } from "../theme/unifiedTheme";

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
    <aside
      className="neu-sidebar"
      style={{
        "--nav-accent": theme.accent,
        "--nav-surface": theme.surface,
        "--nav-text": theme.text,
        "--nav-shadow": SHADOWS.card,
        "--nav-inset": SHADOWS.inset,
      }}
    >
      <div className="neu-sidebar__header">
        <div className="neu-sidebar__badge">
          +
        </div>
        <div>
          <div className="neu-sidebar__title">{title}</div>
          <div className="neu-sidebar__subtitle">{subtitle}</div>
        </div>
      </div>

      <div className="neu-sidebar__tag">
        Club prive · Acces securise
      </div>

      <nav className="neu-sidebar__nav" aria-label="Navigation principale">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `neu-nav-link${isActive ? " is-active" : ""}`}
          >
            <span className="neu-nav-link__icon">{item.icon || "•"}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button onClick={handleLogout} className="neu-logout">
        Se deconnecter
      </button>
    </aside>
  );
}