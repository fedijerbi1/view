import SideBar from "./SideBar";

const ACCENTS = {
  primary: "#2E86C1",
  info: "#3B9DDB",
  success: "#27AE60",
};

export default function PortalLayout({ title, subtitle, items, accent = "primary", children }) {
  const accentColor = ACCENTS[accent] || accent || "#2E86C1";
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F3F7FB" }}>
      <SideBar title={title} subtitle={subtitle} items={items} accent={accent} />
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <header style={{ background: "#FFFFFF", borderBottom: "1px solid #D6EAF8", padding: "18px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
          <div>
            <div style={{ fontSize: 12, color: "#8CA0B3", letterSpacing: "0.12em", textTransform: "uppercase" }}>{title}</div>
            <div style={{ fontWeight: 700, fontSize: 18, color: "#1B2631" }}>{subtitle || "Plateforme Medicale"}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ fontSize: 13, color: "#566573" }}>
              {new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </div>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: accentColor, boxShadow: `0 0 0 3px ${accentColor}33` }} title="Connecte" />
          </div>
        </header>
        <div style={{ flex: 1, padding: "28px 32px", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
          {children}
        </div>
      </main>
    </div>
  );
}
