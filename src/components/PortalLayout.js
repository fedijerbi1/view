import SideBar from "./SideBar";

const ACCENTS = {
  primary: "#1E6FE3",
  info: "#1E6FE3",
  success: "#00A63D",
};

const C = {
  primary: "#1E6FE3",
  secondary: "#F1F2F5",
  surface: "#E7E5E4",
  text: "#1E2938",
  textMuted: "#64748B",
  cardShadow: "8px 8px 16px #c4c3c2, -8px -8px 16px #ffffff",
};

export default function PortalLayout({ title, subtitle, items, accent = "primary", children }) {
  const accentColor = ACCENTS[accent] || accent || "#2E86C1";
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.secondary }}>
      <SideBar title={title} subtitle={subtitle} items={items} accent={accent} />
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <header
          style={{
            background: C.surface,
            padding: "18px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 100,
            boxShadow: C.cardShadow,
          }}
        >
          <div>
            <div style={{ fontSize: 12, color: C.textMuted, letterSpacing: "0.12em", textTransform: "uppercase" }}>{title}</div>
            <div style={{ fontWeight: 700, fontSize: 18, color: C.text }}>{subtitle || "Plateforme Medicale"}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ fontSize: 13, color: C.textMuted }}>
              {new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </div>
            <div
              style={{ width: 10, height: 10, borderRadius: "50%", background: accentColor, boxShadow: `0 0 0 3px ${accentColor}33` }}
              title="Connecte"
            />
          </div>
        </header>
        <div style={{ flex: 1, padding: "28px 32px", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
          {children}
        </div>
      </main>
    </div>
  );
}
