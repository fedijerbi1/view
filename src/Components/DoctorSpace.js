import { useState, useRef, useEffect } from "react";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const T = {
  bg:           "#F4F8FB",
  surface:      "#FFFFFF",
  surfaceAlt:   "#F0F5FA",
  surfaceHover: "#E8F1F8",
  primary:      "#1B6CA8",
  primaryMid:   "#2E86C1",
  primaryLight: "#AED6F1",
  primaryPale:  "#EBF5FB",
  teal:         "#148F77",
  tealLight:    "#A2D9CE",
  tealPale:     "#E8F8F5",
  amber:        "#B7770D",
  amberLight:   "#FAD7A0",
  amberPale:    "#FEF9E7",
  danger:       "#A93226",
  dangerLight:  "#F5B7B1",
  dangerPale:   "#FDEDEC",
  text:         "#1A252F",
  textMid:      "#566573",
  textLight:    "#AAB7B8",
  border:       "#D5E8F3",
  borderMid:    "#A9CCE3",
  shadow:       "0 2px 14px rgba(27,108,168,0.07)",
  shadowMd:     "0 6px 24px rgba(27,108,168,0.12)",
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const PATIENTS = [
  { id: "P001", nom: "Aymen Mabrouk",   age: 34, sexe: "M", pathologie: "Diabète type 2",    statut: "Stable",   photo: "AM", dernierRDV: "26/04/2026", glycemie: 5.8, spo2: 97, bpm: 74, poids: 73 },
  { id: "P002", nom: "Sara Ben Youssef",age: 28, sexe: "F", pathologie: "Hypertension",       statut: "Attention",photo: "SB", dernierRDV: "24/04/2026", glycemie: 5.1, spo2: 98, bpm: 88, poids: 62 },
  { id: "P003", nom: "Karim Jebali",    age: 52, sexe: "M", pathologie: "Insuffisance card.", statut: "Critique", photo: "KJ", dernierRDV: "25/04/2026", glycemie: 6.2, spo2: 93, bpm: 95, poids: 88 },
  { id: "P004", nom: "Fatma Trabelsi",  age: 45, sexe: "F", pathologie: "Asthme",             statut: "Stable",   photo: "FT", dernierRDV: "22/04/2026", glycemie: 4.9, spo2: 96, bpm: 70, poids: 68 },
  { id: "P005", nom: "Mehdi Guesmi",    age: 61, sexe: "M", pathologie: "Diabète type 2",    statut: "Attention", photo: "MG", dernierRDV: "23/04/2026", glycemie: 7.4, spo2: 95, bpm: 82, poids: 91 },
];

const PRESCRIPTIONS_INIT = {
  P001: [
    { id: 1, medicament: "Metformine 500mg", posologie: "1 cp matin et soir", duree: "3 mois",  date: "15/04/2026", statut: "Active" },
    { id: 2, medicament: "Lisinopril 10mg",  posologie: "1 cp le matin",      duree: "6 mois",  date: "10/03/2026", statut: "Active" },
  ],
  P002: [
    { id: 3, medicament: "Amlodipine 5mg",   posologie: "1 cp le soir",        duree: "3 mois",  date: "20/04/2026", statut: "Active" },
  ],
  P003: [
    { id: 4, medicament: "Furosémide 40mg",  posologie: "1 cp le matin",       duree: "2 mois",  date: "25/04/2026", statut: "Active" },
    { id: 5, medicament: "Digoxine 0.25mg",  posologie: "1 cp/j",              duree: "Continu", date: "01/03/2026", statut: "Active" },
  ],
  P004: [],
  P005: [
    { id: 6, medicament: "Glibenclamide 5mg",posologie: "1 cp matin",          duree: "3 mois",  date: "20/04/2026", statut: "Active" },
  ],
};

const RDVS_INIT = [
  { id: 1, patientId: "P001", patient: "Aymen Mabrouk",    date: "28/04/2026", heure: "09:00", motif: "Contrôle glycémie",        statut: "En attente" },
  { id: 2, patientId: "P002", patient: "Sara Ben Youssef", date: "28/04/2026", heure: "10:30", motif: "Suivi tension artérielle",  statut: "Confirmé"   },
  { id: 3, patientId: "P003", patient: "Karim Jebali",     date: "29/04/2026", heure: "08:00", motif: "Urgence cardiaque",         statut: "En attente" },
  { id: 4, patientId: "P005", patient: "Mehdi Guesmi",     date: "30/04/2026", heure: "14:00", motif: "Bilan trimestriel",        statut: "Confirmé"   },
  { id: 5, patientId: "P004", patient: "Fatma Trabelsi",   date: "02/05/2026", heure: "11:00", motif: "Crise asthmatique récente", statut: "En attente" },
];

const MESSAGES_INIT = {
  P001: [
    { from: "patient", text: "Bonjour Docteur, j'ai des vertiges depuis ce matin.", time: "08:15" },
    { from: "medecin", text: "Bonjour Aymen, avez-vous pris votre tension ce matin ?", time: "09:02" },
    { from: "patient", text: "Oui, 132/86. Un peu élevée je pense.", time: "09:05" },
  ],
  P002: [
    { from: "patient", text: "Docteur, j'ai oublié de prendre mon médicament hier soir.", time: "07:30" },
    { from: "medecin", text: "Pas de panique, reprenez normalement ce soir sans doubler.", time: "08:45" },
  ],
  P003: [],
  P004: [
    { from: "patient", text: "Docteur, j'ai eu une légère crise d'asthme hier soir.", time: "20:10" },
  ],
  P005: [],
};

const VITAUX_HISTORY = {
  P001: [
    { date: "20/04", bpm: 72, sys: 118, dia: 76, glycemie: 5.5, spo2: 98 },
    { date: "22/04", bpm: 74, sys: 120, dia: 78, glycemie: 5.8, spo2: 97 },
    { date: "24/04", bpm: 73, sys: 119, dia: 77, glycemie: 5.6, spo2: 97 },
    { date: "26/04", bpm: 74, sys: 121, dia: 79, glycemie: 5.8, spo2: 97 },
  ],
  P002: [
    { date: "20/04", bpm: 85, sys: 138, dia: 88, glycemie: 5.0, spo2: 98 },
    { date: "22/04", bpm: 87, sys: 141, dia: 90, glycemie: 5.2, spo2: 98 },
    { date: "24/04", bpm: 88, sys: 140, dia: 89, glycemie: 5.1, spo2: 98 },
  ],
  P003: [
    { date: "23/04", bpm: 92, sys: 145, dia: 95, glycemie: 6.0, spo2: 94 },
    { date: "25/04", bpm: 95, sys: 148, dia: 97, glycemie: 6.2, spo2: 93 },
  ],
  P004: [
    { date: "20/04", bpm: 68, sys: 115, dia: 74, glycemie: 4.8, spo2: 96 },
    { date: "22/04", bpm: 70, sys: 116, dia: 75, glycemie: 4.9, spo2: 96 },
  ],
  P005: [
    { date: "21/04", bpm: 80, sys: 128, dia: 84, glycemie: 7.1, spo2: 95 },
    { date: "23/04", bpm: 82, sys: 130, dia: 85, glycemie: 7.4, spo2: 95 },
  ],
};

// ─── Shared Components ────────────────────────────────────────────────────────
function Avatar({ initials, size = 38, color = T.primary }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: `${color}20`, border: `1.5px solid ${color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: size * 0.36, color, flexShrink: 0, letterSpacing: 0.5 }}>
      {initials}
    </div>
  );
}

function Badge({ variant = "info", children, size = "sm" }) {
  const v = {
    success:  { bg: T.tealPale,    text: T.teal,    border: T.tealLight },
    warning:  { bg: T.amberPale,   text: T.amber,   border: T.amberLight },
    danger:   { bg: T.dangerPale,  text: T.danger,  border: T.dangerLight },
    info:     { bg: T.primaryPale, text: T.primary, border: T.primaryLight },
    neutral:  { bg: T.surfaceAlt,  text: T.textMid, border: T.border },
  };
  const c = v[variant] || v.info;
  return (
    <span style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}`, borderRadius: 20, padding: size === "sm" ? "3px 10px" : "5px 14px", fontSize: size === "sm" ? 12 : 13, fontWeight: 600, display: "inline-block", whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

function Card({ children, style = {}, onClick }) {
  return (
    <div onClick={onClick} style={{ background: T.surface, borderRadius: 14, border: `1px solid ${T.border}`, boxShadow: T.shadow, padding: "20px 24px", cursor: onClick ? "pointer" : "default", transition: "box-shadow 0.15s", ...style }}
      onMouseEnter={e => onClick && (e.currentTarget.style.boxShadow = T.shadowMd)}
      onMouseLeave={e => onClick && (e.currentTarget.style.boxShadow = T.shadow)}>
      {children}
    </div>
  );
}

function PageTitle({ icon, children, sub }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <span style={{ fontSize: 22 }}>{icon}</span>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: T.primary, letterSpacing: "-0.4px" }}>{children}</h2>
      </div>
      {sub && <p style={{ margin: 0, fontSize: 13, color: T.textMid, paddingLeft: 32 }}>{sub}</p>}
    </div>
  );
}

function StatCard({ icon, label, value, color = T.primary }) {
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, boxShadow: T.shadow }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 24, fontWeight: 800, color: T.text, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 13, color: T.textMid, marginTop: 3 }}>{label}</div>
      </div>
    </div>
  );
}

function MiniBar({ data, valueKey, color }) {
  const max = Math.max(...data.map(d => d[valueKey])) * 1.05;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 50 }}>
      {data.map((d, i) => {
        const h = Math.round((d[valueKey] / max) * 44);
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <div style={{ width: "100%", height: h, background: color, borderRadius: "3px 3px 0 0", opacity: i === data.length - 1 ? 1 : 0.55 }} />
          </div>
        );
      })}
    </div>
  );
}

// Modal
function Modal({ title, subtitle, onClose, children, width = 480 }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(10,30,50,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: T.surface, borderRadius: 18, padding: "28px 32px", width, maxWidth: "95vw", boxShadow: "0 20px 60px rgba(0,0,0,0.18)", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: T.primary }}>{title}</h3>
            {subtitle && <p style={{ margin: "4px 0 0", fontSize: 13, color: T.textMid }}>{subtitle}</p>}
          </div>
          <button onClick={onClose} style={{ background: T.surfaceAlt, border: "none", borderRadius: 8, width: 30, height: 30, cursor: "pointer", color: T.textMid, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, type = "text", value, onChange, options, min, max, step, rows }) {
  const base = { width: "100%", padding: "10px 12px", border: `1.5px solid ${T.borderMid}`, borderRadius: 10, fontSize: 14, color: T.text, background: T.surfaceAlt, boxSizing: "border-box", fontFamily: "inherit", outline: "none" };
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: T.textMid, marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</label>
      {type === "select" ? (
        <select value={value} onChange={e => onChange(e.target.value)} style={base}>
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
      ) : type === "textarea" ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows || 3} style={{ ...base, resize: "vertical" }} />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} min={min} max={max} step={step} style={base} />
      )}
    </div>
  );
}

function Btn({ onClick, children, variant = "primary", size = "md", disabled }) {
  const v = {
    primary: { bg: T.primary, text: "#fff", border: T.primary },
    success: { bg: T.teal, text: "#fff", border: T.teal },
    danger:  { bg: T.danger, text: "#fff", border: T.danger },
    ghost:   { bg: "transparent", text: T.primary, border: T.borderMid },
  };
  const c = v[variant] || v.primary;
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ background: c.bg, color: c.text, border: `1.5px solid ${c.border}`, borderRadius: 10, padding: size === "sm" ? "7px 14px" : "10px 20px", fontSize: size === "sm" ? 13 : 14, fontWeight: 700, cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.5 : 1, fontFamily: "inherit", letterSpacing: 0.2 }}>
      {children}
    </button>
  );
}

function Toast({ msg }) {
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, background: T.teal, color: "#fff", padding: "12px 20px", borderRadius: 12, fontSize: 14, fontWeight: 600, boxShadow: "0 4px 16px rgba(0,0,0,0.2)", zIndex: 2000, display: "flex", alignItems: "center", gap: 8 }}>
      ✅ {msg}
    </div>
  );
}

// ─── Pages ────────────────────────────────────────────────────────────────────

// Dashboard médecin
function DashboardPage({ patients, rdvs, setPage, setSelectedPatient }) {
  const stableCount   = patients.filter(p => p.statut === "Stable").length;
  const attentionCount= patients.filter(p => p.statut === "Attention").length;
  const critiqueCount = patients.filter(p => p.statut === "Critique").length;
  const rdvAujourdhui = rdvs.filter(r => r.date === "28/04/2026");

  return (
    <div>
      <PageTitle icon="🏥" sub={`Lundi 28 avril 2026 · Dr. Wahbi Mzoughi — Cardiologue`}>Vue d'ensemble</PageTitle>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
        <StatCard icon="👥" label="Patients suivis" value={patients.length} color={T.primary} />
        <StatCard icon="✅" label="Stables" value={stableCount} color={T.teal} />
        <StatCard icon="⚠️" label="À surveiller" value={attentionCount} color={T.amber} />
        <StatCard icon="🚨" label="Critiques" value={critiqueCount} color={T.danger} />
      </div>

      {/* Critical alert */}
      {critiqueCount > 0 && (
        <div style={{ background: T.dangerPale, border: `1px solid ${T.dangerLight}`, borderRadius: 12, padding: "14px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 22 }}>🚨</span>
          <div>
            <div style={{ fontWeight: 700, color: T.danger, fontSize: 14 }}>{critiqueCount} patient(s) en état critique</div>
            <div style={{ fontSize: 13, color: "#922B21", marginTop: 2 }}>
              {patients.filter(p => p.statut === "Critique").map(p => p.nom).join(", ")} — Consultation urgente recommandée.
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18 }}>
        {/* RDV du jour */}
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: T.primary }}>📅 Rendez-vous du jour</div>
            <Badge variant="info">{rdvAujourdhui.length} RDV</Badge>
          </div>
          {rdvAujourdhui.length === 0 && <div style={{ color: T.textLight, fontSize: 14 }}>Aucun rendez-vous aujourd'hui.</div>}
          {rdvAujourdhui.map((r, i) => (
            <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i < rdvAujourdhui.length - 1 ? `1px solid ${T.border}` : "none" }}>
              <div style={{ width: 44, height: 44, background: T.primaryPale, borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: T.primary }}>{r.heure}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: T.text }}>{r.patient}</div>
                <div style={{ fontSize: 12, color: T.textMid, marginTop: 2 }}>{r.motif}</div>
              </div>
              <Badge variant={r.statut === "Confirmé" ? "success" : "warning"}>{r.statut}</Badge>
            </div>
          ))}
        </Card>

        {/* Patients critiques */}
        <Card>
          <div style={{ fontWeight: 700, fontSize: 15, color: T.primary, marginBottom: 16 }}>🔴 Surveillance prioritaire</div>
          {patients.filter(p => p.statut !== "Stable").map((p, i, arr) => (
            <div key={p.id} onClick={() => { setSelectedPatient(p); setPage("dossier"); }}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < arr.length - 1 ? `1px solid ${T.border}` : "none", cursor: "pointer" }}>
              <Avatar initials={p.photo} size={34} color={p.statut === "Critique" ? T.danger : T.amber} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: T.text }}>{p.nom}</div>
                <div style={{ fontSize: 12, color: T.textMid }}>{p.pathologie}</div>
              </div>
              <Badge variant={p.statut === "Critique" ? "danger" : "warning"}>{p.statut}</Badge>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// Liste patients (US27)
function PatientsPage({ patients, setSelectedPatient, setPage }) {
  const [search, setSearch] = useState("");
  const [filterStatut, setFilterStatut] = useState("Tous");

  const filtered = patients.filter(p => {
    const matchSearch = p.nom.toLowerCase().includes(search.toLowerCase()) || p.pathologie.toLowerCase().includes(search.toLowerCase());
    const matchStatut = filterStatut === "Tous" || p.statut === filterStatut;
    return matchSearch && matchStatut;
  });

  const statusVariant = { "Stable": "success", "Attention": "warning", "Critique": "danger" };

  return (
    <div>
      <PageTitle icon="👥" sub="Consultez et gérez la liste de vos patients assignés">Liste des patients</PageTitle>

      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <input placeholder="🔍 Rechercher par nom ou pathologie…" value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 240, padding: "10px 16px", border: `1.5px solid ${T.borderMid}`, borderRadius: 10, fontSize: 14, color: T.text, background: T.surfaceAlt, outline: "none", fontFamily: "inherit" }} />
        {["Tous", "Stable", "Attention", "Critique"].map(s => (
          <button key={s} onClick={() => setFilterStatut(s)}
            style={{ padding: "8px 16px", borderRadius: 20, border: `1.5px solid ${filterStatut === s ? T.primary : T.border}`, background: filterStatut === s ? T.primary : "transparent", color: filterStatut === s ? "#fff" : T.textMid, cursor: "pointer", fontSize: 13, fontWeight: filterStatut === s ? 700 : 400, fontFamily: "inherit" }}>
            {s}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map(p => (
          <div key={p.id} onClick={() => { setSelectedPatient(p); setPage("dossier"); }}
            style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: "18px 24px", display: "flex", alignItems: "center", gap: 18, cursor: "pointer", boxShadow: T.shadow, transition: "box-shadow 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = T.shadowMd}
            onMouseLeave={e => e.currentTarget.style.boxShadow = T.shadow}>
            <Avatar initials={p.photo} size={50} color={p.statut === "Critique" ? T.danger : p.statut === "Attention" ? T.amber : T.teal} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <span style={{ fontWeight: 700, fontSize: 16, color: T.text }}>{p.nom}</span>
                <Badge variant={statusVariant[p.statut]}>{p.statut}</Badge>
              </div>
              <div style={{ fontSize: 13, color: T.textMid }}>{p.age} ans · {p.sexe === "M" ? "Homme" : "Femme"} · {p.pathologie}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, flexShrink: 0 }}>
              {[
                { label: "FC", val: `${p.bpm} bpm`, alert: p.bpm > 85 },
                { label: "Poids", val: `${p.poids} kg`, alert: false },
                { label: "SpO2", val: `${p.spo2}%`, alert: p.spo2 < 95 },
                { label: "Glycémie", val: `${p.glycemie}`, alert: p.glycemie > 7 },
              ].map(m => (
                <div key={m.label} style={{ textAlign: "center", padding: "6px 10px", background: m.alert ? T.dangerPale : T.surfaceAlt, borderRadius: 8, minWidth: 64 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: m.alert ? T.danger : T.text }}>{m.val}</div>
                  <div style={{ fontSize: 11, color: m.alert ? T.danger : T.textLight }}>{m.label}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: T.textLight, whiteSpace: "nowrap", paddingLeft: 8 }}>Dernier RDV<br /><strong style={{ color: T.textMid }}>{p.dernierRDV}</strong></div>
            <div style={{ fontSize: 18, color: T.border }}>›</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Dossier médical (US28)
function DossierPage({ patient, vitauxHistory, prescriptions, onBack, setPage, setSelectedPatient, setActiveTab }) {
  const hist = vitauxHistory[patient.id] || [];
  const presc = prescriptions[patient.id] || [];
  const statusVariant = { "Stable": "success", "Attention": "warning", "Critique": "danger" };

  const vitaux = hist[hist.length - 1] || {};

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
        <button onClick={onBack} style={{ background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 10, padding: "8px 14px", cursor: "pointer", fontSize: 13, color: T.textMid, fontFamily: "inherit" }}>← Retour</button>
        <Avatar initials={patient.photo} size={52} color={patient.statut === "Critique" ? T.danger : patient.statut === "Attention" ? T.amber : T.teal} />
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: T.text }}>{patient.nom}</h2>
            <Badge variant={statusVariant[patient.statut]} size="md">{patient.statut}</Badge>
          </div>
          <div style={{ fontSize: 13, color: T.textMid, marginTop: 3 }}>{patient.age} ans · {patient.sexe === "M" ? "Homme" : "Femme"} · {patient.pathologie} · ID: {patient.id}</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
          <Btn variant="ghost" size="sm" onClick={() => { setActiveTab("prescriptions"); setSelectedPatient(patient); setPage("prescriptions"); }}>📋 Prescriptions</Btn>
          <Btn variant="primary" size="sm" onClick={() => { setActiveTab("prescriptions"); setSelectedPatient(patient); setPage("prescriptions"); }}>+ Prescrire</Btn>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Fréq. cardiaque", val: `${patient.bpm} bpm`, alert: patient.bpm > 85, icon: "❤️" },
          { label: "SpO2",            val: `${patient.spo2}%`,   alert: patient.spo2 < 95,  icon: "🫁" },
          { label: "Glycémie",        val: `${patient.glycemie} mmol/L`, alert: patient.glycemie > 7, icon: "🩸" },
          { label: "Poids",           val: `${patient.poids} kg`, alert: false, icon: "⚖️" },
        ].map(m => (
          <div key={m.label} style={{ background: m.alert ? T.dangerPale : T.surfaceAlt, border: `1px solid ${m.alert ? T.dangerLight : T.border}`, borderRadius: 12, padding: "14px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: m.alert ? T.danger : T.textMid, fontWeight: 600 }}>{m.label}</span>
              <span style={{ fontSize: 16 }}>{m.icon}</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: m.alert ? T.danger : T.text }}>{m.val}</div>
            {m.alert && <div style={{ fontSize: 11, color: T.danger, marginTop: 4 }}>⚠ Valeur anormale</div>}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Évolution FC */}
        <Card>
          <div style={{ fontWeight: 700, fontSize: 14, color: T.primary, marginBottom: 14 }}>Évolution fréquence cardiaque</div>
          <MiniBar data={hist} valueKey="bpm" color="#E74C3C" />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            {hist.map((h, i) => <span key={i} style={{ fontSize: 11, color: T.textLight, flex: 1, textAlign: "center" }}>{h.date}</span>)}
          </div>
        </Card>
        {/* Évolution glycémie */}
        <Card>
          <div style={{ fontWeight: 700, fontSize: 14, color: T.primary, marginBottom: 14 }}>Évolution glycémie (mmol/L)</div>
          <MiniBar data={hist} valueKey="glycemie" color={T.amber} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            {hist.map((h, i) => <span key={i} style={{ fontSize: 11, color: T.textLight, flex: 1, textAlign: "center" }}>{h.date}</span>)}
          </div>
        </Card>
      </div>

      {/* Historique tableau */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: T.primary, marginBottom: 14 }}>Historique des mesures</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: T.surfaceAlt }}>
              {["Date", "FC (bpm)", "Systolique", "Diastolique", "Glycémie", "SpO2"].map(h => (
                <th key={h} style={{ padding: "9px 12px", textAlign: "left", color: T.textMid, fontWeight: 700, fontSize: 11, borderBottom: `1px solid ${T.border}`, textTransform: "uppercase", letterSpacing: 0.4 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...hist].reverse().map((row, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
                <td style={{ padding: "9px 12px", color: T.textMid }}>{row.date}</td>
                <td style={{ padding: "9px 12px", fontWeight: 600, color: row.bpm > 85 ? T.danger : T.text }}>{row.bpm}</td>
                <td style={{ padding: "9px 12px" }}>{row.sys}</td>
                <td style={{ padding: "9px 12px" }}>{row.dia}</td>
                <td style={{ padding: "9px 12px", color: row.glycemie > 7 ? T.danger : T.text, fontWeight: row.glycemie > 7 ? 700 : 400 }}>{row.glycemie}</td>
                <td style={{ padding: "9px 12px" }}><Badge variant={row.spo2 >= 95 ? "success" : "danger"}>{row.spo2}%</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Prescriptions actives */}
      <Card>
        <div style={{ fontWeight: 700, fontSize: 14, color: T.primary, marginBottom: 14 }}>Prescriptions actives ({presc.length})</div>
        {presc.length === 0 && <div style={{ color: T.textLight, fontSize: 14 }}>Aucune prescription active.</div>}
        {presc.map((pr, i) => (
          <div key={pr.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0", borderBottom: i < presc.length - 1 ? `1px solid ${T.border}` : "none" }}>
            <div style={{ width: 36, height: 36, background: T.primaryPale, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>💊</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: T.text }}>{pr.medicament}</div>
              <div style={{ fontSize: 12, color: T.textMid }}>{pr.posologie} · {pr.duree}</div>
            </div>
            <div style={{ fontSize: 12, color: T.textLight }}>{pr.date}</div>
            <Badge variant="success">{pr.statut}</Badge>
          </div>
        ))}
      </Card>
    </div>
  );
}

// Prescriptions (US29, US30)
function PrescriptionsPage({ patients, prescriptions, setPrescriptions, selectedPatient, setSelectedPatient }) {
  const [modal, setModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({ medicament: "", posologie: "", duree: "", patientId: selectedPatient?.id || patients[0]?.id });

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const save = () => {
    if (!form.medicament || !form.posologie || !form.duree) return;
    const today = new Date().toLocaleDateString("fr", { day: "2-digit", month: "2-digit", year: "numeric" });
    const newPresc = { id: Date.now(), medicament: form.medicament, posologie: form.posologie, duree: form.duree, date: today, statut: "Active" };
    setPrescriptions(prev => ({
      ...prev,
      [form.patientId]: [...(prev[form.patientId] || []), newPresc],
    }));
    setModal(false);
    showToast("Prescription ajoutée — patient notifié");
    setForm({ medicament: "", posologie: "", duree: "", patientId: patients[0]?.id });
  };

  const displayPatient = selectedPatient || patients[0];
  const presc = prescriptions[displayPatient?.id] || [];

  return (
    <div>
      {toast && <Toast msg={toast} />}
      <PageTitle icon="💊" sub="Gérez les prescriptions électroniques de vos patients">Prescriptions</PageTitle>

      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <select value={displayPatient?.id} onChange={e => setSelectedPatient(patients.find(p => p.id === e.target.value))}
          style={{ padding: "10px 14px", border: `1.5px solid ${T.borderMid}`, borderRadius: 10, fontSize: 14, color: T.text, background: T.surface, fontFamily: "inherit", flex: 1, minWidth: 200 }}>
          {patients.map(p => <option key={p.id} value={p.id}>{p.nom}</option>)}
        </select>
        <Btn onClick={() => setModal(true)}>+ Nouvelle prescription</Btn>
      </div>

      {displayPatient && (
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: T.primaryPale, border: `1px solid ${T.primaryLight}`, borderRadius: 12, padding: "14px 20px", marginBottom: 20 }}>
          <Avatar initials={displayPatient.photo} size={42} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: T.primary }}>{displayPatient.nom}</div>
            <div style={{ fontSize: 13, color: T.textMid }}>{displayPatient.pathologie} · {displayPatient.age} ans</div>
          </div>
          <div style={{ marginLeft: "auto" }}><Badge variant="info">{presc.length} prescription(s) active(s)</Badge></div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {presc.length === 0 && (
          <Card style={{ textAlign: "center", padding: "40px 24px", color: T.textLight }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>💊</div>
            <div>Aucune prescription pour ce patient.</div>
          </Card>
        )}
        {presc.map(pr => (
          <Card key={pr.id}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div style={{ width: 44, height: 44, background: T.primaryPale, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>💊</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ fontWeight: 800, fontSize: 16, color: T.text }}>{pr.medicament}</span>
                  <Badge variant="success">{pr.statut}</Badge>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                  {[
                    { label: "Posologie", val: pr.posologie },
                    { label: "Durée", val: pr.duree },
                    { label: "Prescrit le", val: pr.date },
                  ].map(f => (
                    <div key={f.label}>
                      <div style={{ fontSize: 11, color: T.textLight, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4 }}>{f.label}</div>
                      <div style={{ fontSize: 14, color: T.text, fontWeight: 600, marginTop: 2 }}>{f.val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {modal && (
        <Modal title="Nouvelle prescription" subtitle={`Pour : ${patients.find(p => p.id === form.patientId)?.nom}`} onClose={() => setModal(false)}>
          <Field label="Patient" type="select" value={form.patientId} onChange={v => setForm(f => ({...f, patientId: v}))} options={patients.map(p => p.id)} />
          <div style={{ marginBottom: 14, padding: "10px 14px", background: T.primaryPale, borderRadius: 10, fontSize: 13, color: T.primary }}>
            {patients.find(p => p.id === form.patientId)?.nom} · {patients.find(p => p.id === form.patientId)?.pathologie}
          </div>
          <Field label="Médicament et dosage" value={form.medicament} onChange={v => setForm(f => ({...f, medicament: v}))} />
          <Field label="Posologie" value={form.posologie} onChange={v => setForm(f => ({...f, posologie: v}))} />
          <Field label="Durée du traitement" value={form.duree} onChange={v => setForm(f => ({...f, duree: v}))} />
          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            <Btn variant="ghost" onClick={() => setModal(false)}>Annuler</Btn>
            <div style={{ flex: 1 }}><Btn onClick={save}>✅ Valider et notifier patient</Btn></div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// Recommandations (US31)
function RecommandationsPage({ patients }) {
  const [modal, setModal] = useState(false);
  const [recs, setRecs] = useState([
    { id: 1, patientId: "P001", patient: "Aymen Mabrouk", type: "Activité physique", contenu: "Marche quotidienne de 30 min. Éviter les efforts intenses.", date: "25/04/2026" },
    { id: 2, patientId: "P002", patient: "Sara Ben Youssef", type: "Régime alimentaire", contenu: "Réduire la consommation de sel à moins de 5g/j. Éviter les plats industriels.", date: "24/04/2026" },
    { id: 3, patientId: "P005", patient: "Mehdi Guesmi", type: "Activité physique", contenu: "Natation 2x/semaine. Éviter les sports à fort impact articulaire.", date: "23/04/2026" },
  ]);
  const [form, setForm] = useState({ patientId: patients[0]?.id, type: "Activité physique", contenu: "" });
  const [toast, setToast] = useState(null);

  const save = () => {
    if (!form.contenu) return;
    const today = new Date().toLocaleDateString("fr", { day: "2-digit", month: "2-digit", year: "numeric" });
    const p = patients.find(p => p.id === form.patientId);
    setRecs(r => [...r, { id: Date.now(), patientId: form.patientId, patient: p.nom, type: form.type, contenu: form.contenu, date: today }]);
    setModal(false);
    setToast("Recommandation envoyée au patient");
    setTimeout(() => setToast(null), 3000);
    setForm({ patientId: patients[0]?.id, type: "Activité physique", contenu: "" });
  };

  return (
    <div>
      {toast && <Toast msg={toast} />}
      <PageTitle icon="📋" sub="Envoyez des recommandations personnalisées à vos patients">Recommandations</PageTitle>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
        <Btn onClick={() => setModal(true)}>+ Nouvelle recommandation</Btn>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {recs.map(r => (
          <Card key={r.id}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div style={{ width: 44, height: 44, background: r.type === "Activité physique" ? T.tealPale : T.amberPale, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                {r.type === "Activité physique" ? "🏃" : "🥗"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: T.text }}>{r.patient}</span>
                  <Badge variant={r.type === "Activité physique" ? "success" : "warning"}>{r.type}</Badge>
                </div>
                <div style={{ fontSize: 14, color: T.textMid, lineHeight: 1.6, background: T.surfaceAlt, borderRadius: 8, padding: "10px 14px" }}>{r.contenu}</div>
              </div>
              <div style={{ fontSize: 12, color: T.textLight, whiteSpace: "nowrap" }}>{r.date}</div>
            </div>
          </Card>
        ))}
      </div>

      {modal && (
        <Modal title="Nouvelle recommandation" onClose={() => setModal(false)}>
          <Field label="Patient" type="select" value={form.patientId} onChange={v => setForm(f => ({...f, patientId: v}))} options={patients.map(p => p.id)} />
          <div style={{ marginBottom: 14, fontSize: 13, color: T.primary }}>{patients.find(p => p.id === form.patientId)?.nom}</div>
          <Field label="Type" type="select" value={form.type} onChange={v => setForm(f => ({...f, type: v}))} options={["Activité physique", "Régime alimentaire"]} />
          <Field label="Contenu de la recommandation" type="textarea" value={form.contenu} onChange={v => setForm(f => ({...f, contenu: v}))} rows={4} />
          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            <Btn variant="ghost" onClick={() => setModal(false)}>Annuler</Btn>
            <div style={{ flex: 1 }}><Btn onClick={save}>📤 Envoyer au patient</Btn></div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// Messagerie (US32)
function MessagerPage({ patients, messages, setMessages }) {
  const [selectedPatient, setSelectedPatient] = useState(patients[0]);
  const [text, setText] = useState("");
  const endRef = useRef(null);

  const conv = messages[selectedPatient?.id] || [];

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [conv.length, selectedPatient]);

  const send = () => {
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" });
    setMessages(m => ({
      ...m,
      [selectedPatient.id]: [...(m[selectedPatient.id] || []), { from: "medecin", text: text.trim(), time: now }],
    }));
    setText("");
  };

  const statusVariant = { "Stable": "success", "Attention": "warning", "Critique": "danger" };

  return (
    <div>
      <PageTitle icon="💬" sub="Communiquez directement avec vos patients">Messagerie</PageTitle>
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 0, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden", boxShadow: T.shadow, height: 560 }}>
        {/* Patient list */}
        <div style={{ borderRight: `1px solid ${T.border}`, overflowY: "auto" }}>
          <div style={{ padding: "14px 16px", borderBottom: `1px solid ${T.border}`, fontWeight: 700, fontSize: 13, color: T.textMid, textTransform: "uppercase", letterSpacing: 0.5 }}>Patients</div>
          {patients.map(p => {
            const conv = messages[p.id] || [];
            const last = conv[conv.length - 1];
            const active = selectedPatient?.id === p.id;
            return (
              <div key={p.id} onClick={() => setSelectedPatient(p)}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", cursor: "pointer", background: active ? T.primaryPale : "transparent", borderLeft: active ? `3px solid ${T.primary}` : "3px solid transparent", transition: "background 0.15s" }}>
                <Avatar initials={p.photo} size={38} color={active ? T.primary : T.textLight} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: active ? T.primary : T.text }}>{p.nom}</div>
                  {last && <div style={{ fontSize: 11, color: T.textLight, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{last.text}</div>}
                </div>
                {last?.from === "patient" && <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.primary, flexShrink: 0 }} />}
              </div>
            );
          })}
        </div>

        {/* Chat area */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "14px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar initials={selectedPatient?.photo} size={36} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: T.text }}>{selectedPatient?.nom}</div>
              <div style={{ fontSize: 12, color: T.textMid }}>{selectedPatient?.pathologie}</div>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
            {conv.length === 0 && (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: T.textLight, fontSize: 14 }}>Aucun message — démarrez la conversation</div>
            )}
            {conv.map((msg, i) => {
              const isMe = msg.from === "medecin";
              return (
                <div key={i} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start" }}>
                  <div style={{ maxWidth: "70%", background: isMe ? T.primary : T.surfaceAlt, color: isMe ? "#fff" : T.text, borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px", padding: "10px 14px", fontSize: 14 }}>
                    <div>{msg.text}</div>
                    <div style={{ fontSize: 11, marginTop: 4, opacity: 0.7, textAlign: "right" }}>{msg.time}</div>
                  </div>
                </div>
              );
            })}
            <div ref={endRef} />
          </div>

          <div style={{ padding: "14px 20px", borderTop: `1px solid ${T.border}`, display: "flex", gap: 10 }}>
            <input placeholder="Écrire un message…" value={text} onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              style={{ flex: 1, padding: "10px 14px", border: `1.5px solid ${T.borderMid}`, borderRadius: 24, fontSize: 14, color: T.text, background: T.surfaceAlt, outline: "none", fontFamily: "inherit" }} />
            <button onClick={send} style={{ background: T.primary, color: "#fff", border: "none", borderRadius: 24, padding: "10px 18px", cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: "inherit" }}>Envoyer →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Rendez-vous (US33)
function RendezVousPage({ rdvs, setRdvs }) {
  const [toast, setToast] = useState(null);
  const [modalAnnul, setModalAnnul] = useState(null);
  const [motif, setMotif] = useState("");

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const confirm = (id) => {
    setRdvs(rs => rs.map(r => r.id === id ? { ...r, statut: "Confirmé" } : r));
    showToast("Rendez-vous confirmé — patient notifié");
  };

  const annuler = () => {
    setRdvs(rs => rs.map(r => r.id === modalAnnul.id ? { ...r, statut: "Annulé", motif } : r));
    setModalAnnul(null);
    setMotif("");
    showToast("Rendez-vous annulé — patient notifié");
  };

  const grouped = rdvs.reduce((acc, r) => {
    acc[r.date] = acc[r.date] || [];
    acc[r.date].push(r);
    return acc;
  }, {});

  const statusV = { "Confirmé": "success", "En attente": "warning", "Annulé": "danger" };

  return (
    <div>
      {toast && <Toast msg={toast} />}
      <PageTitle icon="📅" sub="Gérez votre agenda et les rendez-vous en attente">Rendez-vous</PageTitle>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
        <StatCard icon="📋" label="Total RDV" value={rdvs.length} />
        <StatCard icon="⏳" label="En attente" value={rdvs.filter(r => r.statut === "En attente").length} color={T.amber} />
        <StatCard icon="✅" label="Confirmés" value={rdvs.filter(r => r.statut === "Confirmé").length} color={T.teal} />
      </div>

      {Object.entries(grouped).sort().map(([date, list]) => (
        <div key={date} style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.textMid, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ display: "inline-block", width: 24, height: 1, background: T.border }} />
            {date}
            <span style={{ display: "inline-block", flex: 1, height: 1, background: T.border }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {list.map(r => (
              <div key={r.id} style={{ background: T.surface, border: `1px solid ${r.statut === "Annulé" ? T.dangerLight : T.border}`, borderRadius: 14, padding: "16px 22px", display: "flex", alignItems: "center", gap: 16, boxShadow: T.shadow, opacity: r.statut === "Annulé" ? 0.6 : 1 }}>
                <div style={{ width: 50, background: T.primaryPale, borderRadius: 10, padding: "8px 6px", textAlign: "center", flexShrink: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: T.primary }}>{r.heure}</div>
                </div>
                <Avatar initials={r.patient.split(" ").map(n => n[0]).join("").slice(0, 2)} size={40} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: T.text, marginBottom: 3 }}>{r.patient}</div>
                  <div style={{ fontSize: 13, color: T.textMid }}>{r.motif}</div>
                </div>
                <Badge variant={statusV[r.statut]}>{r.statut}</Badge>
                {r.statut !== "Annulé" && (
                  <div style={{ display: "flex", gap: 8 }}>
                    {r.statut === "En attente" && <Btn variant="success" size="sm" onClick={() => confirm(r.id)}>✅ Confirmer</Btn>}
                    <Btn variant="ghost" size="sm" onClick={() => setModalAnnul(r)}>Annuler</Btn>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {modalAnnul && (
        <Modal title="Annuler le rendez-vous" subtitle={`${modalAnnul.patient} · ${modalAnnul.date} à ${modalAnnul.heure}`} onClose={() => setModalAnnul(null)}>
          <Field label="Motif d'annulation" type="textarea" value={motif} onChange={setMotif} rows={3} />
          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            <Btn variant="ghost" onClick={() => setModalAnnul(null)}>Retour</Btn>
            <div style={{ flex: 1 }}><Btn variant="danger" onClick={annuler}>Confirmer l'annulation</Btn></div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// Rapports (US34)
function RapportsPage({ patients, vitauxHistory, prescriptions }) {
  const [selectedPatient, setSelectedPatient] = useState(patients[0]);
  const [typeRapport, setTypeRapport] = useState("Mensuel");
  const [generated, setGenerated] = useState(null);
  const [toast, setToast] = useState(null);

  const generate = () => {
    const p = selectedPatient;
    const hist = vitauxHistory[p.id] || [];
    const presc = prescriptions[p.id] || [];
    const last = hist[hist.length - 1] || {};
    const avgBpm = hist.length ? Math.round(hist.reduce((s, h) => s + h.bpm, 0) / hist.length) : "-";
    const avgGly = hist.length ? (hist.reduce((s, h) => s + h.glycemie, 0) / hist.length).toFixed(1) : "-";
    setGenerated({ p, hist, presc, last, avgBpm, avgGly, date: new Date().toLocaleDateString("fr", { day: "2-digit", month: "long", year: "numeric" }) });
    setToast("Rapport généré avec succès");
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div>
      {toast && <Toast msg={toast} />}
      <PageTitle icon="📊" sub="Générez des rapports périodiques pour le suivi de vos patients">Rapports médicaux</PageTitle>

      <Card style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: T.primary, marginBottom: 16 }}>Paramètres du rapport</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 14, alignItems: "end" }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: T.textMid, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Patient</label>
            <select value={selectedPatient?.id} onChange={e => setSelectedPatient(patients.find(p => p.id === e.target.value))}
              style={{ width: "100%", padding: "10px 12px", border: `1.5px solid ${T.borderMid}`, borderRadius: 10, fontSize: 14, color: T.text, background: T.surfaceAlt, fontFamily: "inherit" }}>
              {patients.map(p => <option key={p.id} value={p.id}>{p.nom}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: T.textMid, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Type de rapport</label>
            <select value={typeRapport} onChange={e => setTypeRapport(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", border: `1.5px solid ${T.borderMid}`, borderRadius: 10, fontSize: 14, color: T.text, background: T.surfaceAlt, fontFamily: "inherit" }}>
              {["Quotidien", "Hebdomadaire", "Mensuel"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <Btn onClick={generate}>⚙️ Générer</Btn>
        </div>
      </Card>

      {generated && (
        <Card>
          {/* Report header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: `2px solid ${T.primary}`, paddingBottom: 16, marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.primary, textTransform: "uppercase", letterSpacing: 0.6 }}>Rapport {typeRapport} · {generated.date}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: T.text, marginTop: 4 }}>{generated.p.nom}</div>
              <div style={{ fontSize: 13, color: T.textMid }}>{generated.p.pathologie} · {generated.p.age} ans · ID: {generated.p.id}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.primary }}>Dr. Wahbi Mzoughi</div>
              <div style={{ fontSize: 12, color: T.textMid }}>Cardiologue</div>
              <Badge variant="info" style={{ marginTop: 6 }}>Rapport officiel</Badge>
            </div>
          </div>

          {/* Summary */}
          <div style={{ fontWeight: 700, fontSize: 14, color: T.primary, marginBottom: 12 }}>📋 Résumé clinique</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 20 }}>
            {[
              { label: "FC moyenne", val: `${generated.avgBpm} bpm`, alert: generated.avgBpm > 85 },
              { label: "SpO2 récente", val: `${generated.last.spo2 || "-"}%`, alert: (generated.last.spo2 || 99) < 95 },
              { label: "Glycémie moy.", val: `${generated.avgGly}`, alert: parseFloat(generated.avgGly) > 7 },
              { label: "Prescriptions", val: generated.presc.length, alert: false },
            ].map(m => (
              <div key={m.label} style={{ background: m.alert ? T.dangerPale : T.surfaceAlt, border: `1px solid ${m.alert ? T.dangerLight : T.border}`, borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: m.alert ? T.danger : T.text }}>{m.val}</div>
                <div style={{ fontSize: 11, color: m.alert ? T.danger : T.textLight, marginTop: 4 }}>{m.label}</div>
              </div>
            ))}
          </div>

          {/* Vital history */}
          <div style={{ fontWeight: 700, fontSize: 14, color: T.primary, marginBottom: 12 }}>📈 Évolution des constantes</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginBottom: 20 }}>
            <thead>
              <tr style={{ background: T.surfaceAlt }}>
                {["Date", "FC", "Systolique", "Diastolique", "Glycémie", "SpO2"].map(h => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: T.textMid, fontWeight: 700, fontSize: 11, borderBottom: `1px solid ${T.border}`, textTransform: "uppercase", letterSpacing: 0.4 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {generated.hist.map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
                  <td style={{ padding: "8px 12px", color: T.textMid }}>{row.date}</td>
                  <td style={{ padding: "8px 12px", fontWeight: 600 }}>{row.bpm}</td>
                  <td style={{ padding: "8px 12px" }}>{row.sys}</td>
                  <td style={{ padding: "8px 12px" }}>{row.dia}</td>
                  <td style={{ padding: "8px 12px", color: row.glycemie > 7 ? T.danger : T.text, fontWeight: row.glycemie > 7 ? 700 : 400 }}>{row.glycemie}</td>
                  <td style={{ padding: "8px 12px" }}><Badge variant={row.spo2 >= 95 ? "success" : "danger"}>{row.spo2}%</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Prescriptions */}
          <div style={{ fontWeight: 700, fontSize: 14, color: T.primary, marginBottom: 12 }}>💊 Traitements en cours</div>
          {generated.presc.length === 0 && <p style={{ color: T.textLight, fontSize: 14 }}>Aucune prescription active.</p>}
          {generated.presc.map(pr => (
            <div key={pr.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>💊 {pr.medicament}</span>
              <span style={{ fontSize: 13, color: T.textMid }}>{pr.posologie}</span>
              <span style={{ fontSize: 13, color: T.textMid }}>{pr.duree}</span>
            </div>
          ))}

          <div style={{ marginTop: 24, padding: "14px 18px", background: T.surfaceAlt, borderRadius: 10, fontSize: 13, color: T.textMid, borderLeft: `3px solid ${T.primary}` }}>
            <strong style={{ color: T.primary }}>Conclusion :</strong> Statut général {generated.p.statut.toLowerCase()}. {generated.p.statut === "Critique" ? "Suivi médical urgent requis." : generated.p.statut === "Attention" ? "Surveillance accrue recommandée." : "Traitement à poursuivre, prochain contrôle dans 1 mois."}
          </div>

          <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <Btn variant="ghost" size="sm">🖨️ Imprimer</Btn>
            <Btn variant="primary" size="sm">📄 Exporter PDF</Btn>
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────
const NAV = [
  { key: "dashboard",     icon: "🏥", label: "Vue d'ensemble" },
  { key: "patients",      icon: "👥", label: "Patients" },
  { key: "dossier",       icon: "📁", label: "Dossier médical", hidden: true },
  { key: "prescriptions", icon: "💊", label: "Prescriptions" },
  { key: "recommandations",icon: "📋", label: "Recommandations" },
  { key: "messagerie",    icon: "💬", label: "Messagerie" },
  { key: "rendezvous",    icon: "📅", label: "Rendez-vous" },
  { key: "rapports",      icon: "📊", label: "Rapports" },
];

export default function DoctorSpace() {
  const [page, setPage]   = useState("dashboard");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeTab, setActiveTab] = useState(null);

  const [prescriptions, setPrescriptions] = useState(PRESCRIPTIONS_INIT);
  const [rdvs, setRdvs]   = useState(RDVS_INIT);
  const [messages, setMessages] = useState(MESSAGES_INIT);

  const unreadMsg = Object.values(messages).flat().filter(m => m.from === "patient").length;
  const pendingRdv = rdvs.filter(r => r.statut === "En attente").length;

  const renderPage = () => {
    switch (page) {
      case "dashboard":     return <DashboardPage patients={PATIENTS} rdvs={rdvs} setPage={setPage} setSelectedPatient={setSelectedPatient} />;
      case "patients":      return <PatientsPage patients={PATIENTS} setSelectedPatient={setSelectedPatient} setPage={setPage} />;
      case "dossier":       return selectedPatient ? <DossierPage patient={selectedPatient} vitauxHistory={VITAUX_HISTORY} prescriptions={prescriptions} onBack={() => setPage("patients")} setPage={setPage} setSelectedPatient={setSelectedPatient} setActiveTab={setActiveTab} /> : null;
      case "prescriptions": return <PrescriptionsPage patients={PATIENTS} prescriptions={prescriptions} setPrescriptions={setPrescriptions} selectedPatient={selectedPatient} setSelectedPatient={setSelectedPatient} />;
      case "recommandations":return <RecommandationsPage patients={PATIENTS} />;
      case "messagerie":    return <MessagerPage patients={PATIENTS} messages={messages} setMessages={setMessages} />;
      case "rendezvous":    return <RendezVousPage rdvs={rdvs} setRdvs={setRdvs} />;
      case "rapports":      return <RapportsPage patients={PATIENTS} vitauxHistory={VITAUX_HISTORY} prescriptions={prescriptions} />;
      default: return null;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', 'Helvetica Neue', system-ui, sans-serif", background: T.bg, color: T.text }}>
      {/* Sidebar */}
      <aside style={{ width: 250, background: T.surface, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", flexShrink: 0, boxShadow: "2px 0 16px rgba(27,108,168,0.06)" }}>
        {/* Logo */}
        <div style={{ padding: "22px 20px 18px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: T.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🏥</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: T.primary, letterSpacing: "-0.3px" }}>SantéApp</div>
              <div style={{ fontSize: 11, color: T.textLight, fontWeight: 600, letterSpacing: 0.3 }}>ESPACE MÉDECIN</div>
            </div>
          </div>
        </div>

        {/* Doctor profile */}
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${T.border}`, background: T.surfaceAlt }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: T.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, color: T.primaryDark || T.primary }}>WM</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: T.text }}>Dr. Wahbi Mzoughi</div>
              <div style={{ fontSize: 11, color: T.textLight }}>Cardiologue · N°Ord. 4821</div>
            </div>
          </div>
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.teal }} />
            <span style={{ fontSize: 11, color: T.teal, fontWeight: 600 }}>En service</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
          {NAV.filter(n => !n.hidden).map(item => {
            const active = page === item.key || (page === "dossier" && item.key === "patients");
            const badge = item.key === "messagerie" ? unreadMsg : item.key === "rendezvous" ? pendingRdv : 0;
            return (
              <button key={item.key} onClick={() => setPage(item.key)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", marginBottom: 3, borderRadius: 10, border: "none", background: active ? `${T.primary}18` : "transparent", color: active ? T.primary : T.textMid, cursor: "pointer", textAlign: "left", fontWeight: active ? 700 : 500, fontSize: 14, transition: "all 0.15s", position: "relative", fontFamily: "inherit" }}>
                <span style={{ fontSize: 17 }}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {badge > 0 && (
                  <span style={{ background: T.danger, color: "#fff", borderRadius: 10, padding: "1px 7px", fontSize: 11, fontWeight: 700 }}>{badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: "14px 20px", borderTop: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 11, color: T.textLight, marginBottom: 8 }}>Équipe Sprint 3</div>
          <div style={{ display: "flex", gap: 5 }}>
            {[{ i: "W", c: T.primary }, { i: "F", c: T.teal }, { i: "A", c: T.amber }, { i: "C", c: "#8E44AD" }].map(m => (
              <div key={m.i} style={{ width: 26, height: 26, borderRadius: "50%", background: m.c, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#fff" }}>{m.i}</div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top bar */}
        <header style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, position: "sticky", top: 0, zIndex: 100 }}>
          <div>
            <span style={{ fontSize: 12, color: T.textLight }}>Tableau de bord / </span>
            <span style={{ fontSize: 12, color: T.primary, fontWeight: 600 }}>{NAV.find(n => n.key === page)?.label || "Dossier médical"}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {pendingRdv > 0 && (
              <button onClick={() => setPage("rendezvous")} style={{ background: T.amberPale, border: `1px solid ${T.amberLight}`, color: T.amber, borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                ⏳ {pendingRdv} RDV en attente
              </button>
            )}
            <div style={{ fontSize: 13, color: T.textMid }}>
              {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: "auto", padding: "28px 36px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
}