import { useEffect, useState } from "react";
import axios from "axios";

// ─── Color Tokens ───────────────────────────────────────────────────────────
const C = {
  bg: "#F0F7FF",
  surface: "#FFFFFF",
  surfaceAlt: "#F8FBFF",
  primary: "#2E86C1",
  primaryLight: "#AED6F1",
  primaryDark: "#1A5276",
  accent: "#27AE60",
  accentLight: "#A9DFBF",
  warning: "#E67E22",
  danger: "#E74C3C",
  dangerLight: "#FADBD8",
  text: "#1B2631",
  textMid: "#566573",
  textLight: "#AEB6BF",
  border: "#D6EAF8",
  borderMid: "#A9CCE3",
  cardShadow: "0 2px 12px rgba(46,134,193,0.08)",
};

const API_BASE = "http://localhost:5000/api";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const calcIMC = (poids, taille = 1.74) => (poids / (taille * taille)).toFixed(1);
const pct = (a, b) => {
  if (!b) return 0;
  return Math.min(100, Math.round((a / b) * 100));
};
const toDateLabel = (dateValue) => {
  if (!dateValue) return "";
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.valueOf())) return "";
  return parsed.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
};

function Badge({ color, children }) {
  const colors = {
    success: { bg: "#EAFAF1", text: "#1E8449" },
    warning: { bg: "#FEF9E7", text: "#B7770D" },
    danger: { bg: "#FDEDEC", text: "#A93226" },
    info: { bg: "#EBF5FB", text: "#1A5276" },
  };
  const c = colors[color] || colors.info;
  return (
    <span style={{ background: c.bg, color: c.text, borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 600 }}>
      {children}
    </span>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, boxShadow: C.cardShadow, padding: "20px 24px", ...style }}>
      {children}
    </div>
  );
}

function SectionTitle({ children, sub }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.primaryDark, letterSpacing: "-0.3px" }}>{children}</h2>
      {sub && <p style={{ margin: "4px 0 0", fontSize: 13, color: C.textMid }}>{sub}</p>}
    </div>
  );
}

function MetricTile({ label, value, unit, status, icon }) {
  const statusColor = status === "normal" ? C.accent : status === "warning" ? C.warning : C.danger;
  return (
    <div style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 18px", display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 13, color: C.textMid, fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 18 }}>{icon}</span>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <span style={{ fontSize: 26, fontWeight: 700, color: C.text }}>{value}</span>
        <span style={{ fontSize: 13, color: C.textLight }}>{unit}</span>
      </div>
      <div style={{ width: "100%", height: 3, background: C.border, borderRadius: 2 }}>
        <div style={{ width: `${status === "normal" ? 100 : status === "warning" ? 65 : 35}%`, height: 3, background: statusColor, borderRadius: 2 }} />
      </div>
    </div>
  );
}

function BarChart({ data, valueKey, color, max }) {
  const maxVal = max || Math.max(1, ...data.map(d => d[valueKey])) * 1.1;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 100 }}>
      {data.map((d, i) => {
        const h = Math.round((d[valueKey] / maxVal) * 90);
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ fontSize: 11, color: C.textLight }}>{d[valueKey]}</div>
            <div style={{ width: "100%", height: h, background: color, borderRadius: "4px 4px 0 0", transition: "height 0.4s ease" }} />
            <div style={{ fontSize: 11, color: C.textMid }}>{d.date}</div>
          </div>
        );
      })}
    </div>
  );
}

function ProgressRing({ pct: p, size = 64, color }) {
  const r = (size / 2) - 6;
  const circ = 2 * Math.PI * r;
  const dash = circ * (p / 100);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.border} strokeWidth={5} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={5}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
    </svg>
  );
}

function GoalCard({ goal, onEdit, onDelete }) {
  const p = pct(goal.actuel, goal.cible);
  const color = p >= 90 ? C.accent : p >= 60 ? C.warning : C.danger;
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ position: "relative", flexShrink: 0 }}>
        <ProgressRing pct={p} size={60} color={color} />
        <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: 18, marginTop: 1 }}>{goal.icon}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: C.text, marginBottom: 2 }}>{goal.type}</div>
        <div style={{ fontSize: 13, color: C.textMid }}>
          {goal.actuel} / {goal.cible} {goal.unite} · {goal.periode}
        </div>
        <div style={{ marginTop: 8, background: C.border, borderRadius: 4, height: 5 }}>
          <div style={{ width: `${p}%`, height: 5, background: color, borderRadius: 4, transition: "width 0.5s" }} />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
        <span style={{ fontSize: 22, fontWeight: 700, color }}>{p}%</span>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => onEdit(goal)} style={{ fontSize: 11, padding: "3px 8px", background: C.primaryLight, color: C.primaryDark, border: "none", borderRadius: 6, cursor: "pointer" }}>Modifier</button>
          <button onClick={() => onDelete(goal.id)} style={{ fontSize: 11, padding: "3px 8px", background: C.dangerLight, color: C.danger, border: "none", borderRadius: 6, cursor: "pointer" }}>Suppr.</button>
        </div>
      </div>
    </div>
  );
}

// ─── Modal ───────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: C.surface, borderRadius: 20, padding: 28, width: 420, maxWidth: "90vw", boxShadow: "0 12px 40px rgba(0,0,0,0.18)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 18, color: C.primaryDark }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: C.textMid, lineHeight: 1 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FormField({ label, type = "number", value, onChange, unit, min, max, step }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: C.textMid, display: "block", marginBottom: 5 }}>{label}</label>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input type={type} value={value} onChange={e => onChange(e.target.value)} min={min} max={max} step={step}
          style={{ flex: 1, padding: "10px 12px", border: `1.5px solid ${C.borderMid}`, borderRadius: 10, fontSize: 15, color: C.text, background: C.surfaceAlt, outline: "none" }} />
        {unit && <span style={{ fontSize: 13, color: C.textLight, whiteSpace: "nowrap" }}>{unit}</span>}
      </div>
    </div>
  );
}

function SubmitBtn({ onClick, children }) {
  return (
    <button onClick={onClick} style={{ width: "100%", padding: "12px", background: C.primary, color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", marginTop: 6, letterSpacing: 0.3 }}>
      {children}
    </button>
  );
}

// ─── Pages ───────────────────────────────────────────────────────────────────

// Dashboard
function Dashboard({ vitals, bio, activity, goals }) {
  const last = vitals[vitals.length - 1] || { bpm: 0, sys: 0, dia: 0, temp: 0 };
  const lastBio = bio[bio.length - 1] || { poids: 0, imc: 0 };
  const weekPas = activity.reduce((s, d) => s + d.pas, 0);
  const weekCal = activity.reduce((s, d) => s + d.cal, 0);

  return (
    <div>
      <SectionTitle sub="Vue d'ensemble de votre santé aujourd'hui">Tableau de bord</SectionTitle>

      {last.bpm > 78 && (
        <div style={{ background: "#FEF9E7", border: "1px solid #F9E79F", borderRadius: 12, padding: "12px 18px", marginBottom: 18, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <span style={{ fontSize: 14, color: "#7D6608" }}>Fréquence cardiaque légèrement élevée · {last.bpm} bpm — Consultez votre médecin si la tendance persiste.</span>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        <MetricTile label="Fréq. cardiaque" value={last.bpm} unit="bpm" icon="❤️" status={last.bpm < 80 ? "normal" : "warning"} />
        <MetricTile label="Pression" value={`${last.sys}/${last.dia}`} unit="mmHg" icon="🩺" status={last.sys < 130 ? "normal" : "warning"} />
        <MetricTile label="Température" value={last.temp} unit="°C" icon="🌡️" status={last.temp < 37.5 ? "normal" : "danger"} />
        <MetricTile label="IMC" value={lastBio.imc} unit="kg/m²" icon="⚖️" status={lastBio.imc < 25 ? "normal" : "warning"} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <Card>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.primaryDark, marginBottom: 14 }}>Pas quotidiens — 7 jours</div>
          <BarChart data={activity} valueKey="pas" color={C.primary} />
        </Card>
        <Card>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.primaryDark, marginBottom: 14 }}>Fréquence cardiaque — 7 jours</div>
          <BarChart data={vitals} valueKey="bpm" color="#E74C3C" />
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.primaryDark, marginBottom: 16 }}>Résumé hebdomadaire</div>
          {[
            { label: "Pas totaux", val: weekPas.toLocaleString("fr"), unit: "pas" },
            { label: "Calories brûlées", val: weekCal.toLocaleString("fr"), unit: "kcal" },
            { label: "Poids actuel", val: lastBio.poids, unit: "kg" },
            { label: "SpO2 récent", val: "98", unit: "%" },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 3 ? `1px solid ${C.border}` : "none" }}>
              <span style={{ fontSize: 14, color: C.textMid }}>{r.label}</span>
              <span style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{r.val} <span style={{ fontWeight: 400, fontSize: 12, color: C.textLight }}>{r.unit}</span></span>
            </div>
          ))}
        </Card>
        <Card>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.primaryDark, marginBottom: 14 }}>Progression objectifs</div>
          {goals.slice(0, 3).map(g => {
            const p = pct(g.actuel, g.cible);
            const col = p >= 90 ? C.accent : p >= 60 ? C.warning : C.danger;
            return (
              <div key={g.id} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 13, color: C.textMid }}>{g.icon} {g.type}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: col }}>{p}%</span>
                </div>
                <div style={{ background: C.border, borderRadius: 4, height: 7 }}>
                  <div style={{ width: `${p}%`, height: 7, background: col, borderRadius: 4, transition: "width 0.5s" }} />
                </div>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
}

// Vitals page
function VitalsPage({ vitals, setVitals }) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ bpm: "", sys: "", dia: "", temp: "" });
  const [saved, setSaved] = useState(false);

  const save = async () => {
    if (!form.bpm || !form.sys || !form.dia || !form.temp) return;
    const token = localStorage.getItem("token");
    const payload = { bpm: +form.bpm, sys: +form.sys, dia: +form.dia, temp: +form.temp };
    const response = await axios.post(`${API_BASE}/patient/vitals`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = response.data;
    setVitals(v => [...v, { date: toDateLabel(data.measure_date), bpm: data.bpm, sys: data.sys, dia: data.dia, temp: Number(data.temp) }]);
    setModal(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setForm({ bpm: "", sys: "", dia: "", temp: "" });
  };

  const last = vitals[vitals.length - 1] || { bpm: 0, sys: 0, dia: 0, temp: 0 };

  return (
    <div>
      <SectionTitle sub="Enregistrement et suivi de vos signes vitaux">Signes vitaux</SectionTitle>
      {saved && <div style={{ background: "#EAFAF1", border: "1px solid #A9DFBF", borderRadius: 10, padding: "10px 16px", marginBottom: 16, color: "#1E8449", fontSize: 14 }}>✅ Données enregistrées avec succès !</div>}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 18 }}>
        <button onClick={() => setModal(true)} style={{ background: C.primary, color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          + Nouvelle saisie
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        <MetricTile label="Fréq. cardiaque" value={last.bpm} unit="bpm" icon="❤️" status={last.bpm < 80 ? "normal" : "warning"} />
        <MetricTile label="Systolique" value={last.sys} unit="mmHg" icon="🩺" status={last.sys < 130 ? "normal" : "warning"} />
        <MetricTile label="Diastolique" value={last.dia} unit="mmHg" icon="🩺" status={last.dia < 85 ? "normal" : "warning"} />
        <MetricTile label="Température" value={last.temp} unit="°C" icon="🌡️" status={last.temp < 37.5 ? "normal" : "danger"} />
      </div>

      <Card>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.primaryDark, marginBottom: 16 }}>Historique — Fréquence cardiaque</div>
        <BarChart data={vitals.slice(-7)} valueKey="bpm" color="#E74C3C" />
      </Card>

      <Card style={{ marginTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.primaryDark, marginBottom: 14 }}>Historique complet</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: C.surfaceAlt }}>
              {["Date", "FC (bpm)", "Systolique", "Diastolique", "Temp. (°C)", "Statut"].map(h => (
                <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: C.textMid, fontWeight: 600, fontSize: 12, borderBottom: `1px solid ${C.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...vitals].reverse().map((row, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: "10px 12px", color: C.textMid }}>{row.date}</td>
                <td style={{ padding: "10px 12px", fontWeight: 600 }}>{row.bpm}</td>
                <td style={{ padding: "10px 12px" }}>{row.sys}</td>
                <td style={{ padding: "10px 12px" }}>{row.dia}</td>
                <td style={{ padding: "10px 12px" }}>{row.temp}</td>
                <td style={{ padding: "10px 12px" }}>
                  <Badge color={row.bpm < 80 && row.temp < 37.5 ? "success" : row.bpm < 95 ? "warning" : "danger"}>
                    {row.bpm < 80 && row.temp < 37.5 ? "Normal" : row.bpm < 95 ? "Attention" : "Critique"}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {modal && (
        <Modal title="Saisir les signes vitaux" onClose={() => setModal(false)}>
          <FormField label="Fréquence cardiaque" value={form.bpm} onChange={v => setForm(f => ({ ...f, bpm: v }))} unit="bpm" min={40} max={200} />
          <FormField label="Pression systolique" value={form.sys} onChange={v => setForm(f => ({ ...f, sys: v }))} unit="mmHg" min={80} max={200} />
          <FormField label="Pression diastolique" value={form.dia} onChange={v => setForm(f => ({ ...f, dia: v }))} unit="mmHg" min={50} max={130} />
          <FormField label="Température" value={form.temp} onChange={v => setForm(f => ({ ...f, temp: v }))} unit="°C" min={35} max={42} step={0.1} />
          <SubmitBtn onClick={save}>Enregistrer</SubmitBtn>
        </Modal>
      )}
    </div>
  );
}

// Biometrics
function BiometricsPage({ bio, setBio }) {
  const [modal, setModal] = useState(false);
  const [poids, setPoids] = useState("");
  const [saved, setSaved] = useState(false);

  const save = async () => {
    if (!poids) return;
    const token = localStorage.getItem("token");
    const imc = +calcIMC(+poids);
    const payload = { poids: +poids, imc };
    const response = await axios.post(`${API_BASE}/patient/biometrics`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = response.data;

    setBio(b => [...b, { date: toDateLabel(data.measure_date), poids: Number(data.poids), imc: Number(data.imc) }]);
    setModal(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setPoids("");
  };

  const last = bio[bio.length - 1] || { poids: 0, imc: 0 };
  const imcCateg = last.imc < 18.5 ? { label: "Insuffisance pondérale", color: "info" }
    : last.imc < 25 ? { label: "Poids normal", color: "success" }
    : last.imc < 30 ? { label: "Surpoids", color: "warning" }
    : { label: "Obésité", color: "danger" };

  return (
    <div>
      <SectionTitle sub="Suivi du poids et de l'indice de masse corporelle">Données biométriques</SectionTitle>
      {saved && <div style={{ background: "#EAFAF1", border: "1px solid #A9DFBF", borderRadius: 10, padding: "10px 16px", marginBottom: 16, color: "#1E8449", fontSize: 14 }}>✅ Données enregistrées !</div>}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 18 }}>
        <button onClick={() => setModal(true)} style={{ background: C.primary, color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          + Nouvelle pesée
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
        <MetricTile label="Poids actuel" value={last.poids} unit="kg" icon="⚖️" status="normal" />
        <MetricTile label="IMC" value={last.imc} unit="kg/m²" icon="📊" status={last.imc < 25 ? "normal" : "warning"} />
        <div style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 18px", display: "flex", flexDirection: "column", gap: 8, justifyContent: "center" }}>
          <span style={{ fontSize: 13, color: C.textMid, fontWeight: 500 }}>Catégorie IMC</span>
          <Badge color={imcCateg.color}>{imcCateg.label}</Badge>
        </div>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.primaryDark, marginBottom: 14 }}>Évolution du poids</div>
        <BarChart data={bio} valueKey="poids" color={C.primary} />
      </Card>

      <Card>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.primaryDark, marginBottom: 14 }}>Historique</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: C.surfaceAlt }}>
              {["Date", "Poids (kg)", "IMC", "Catégorie"].map(h => (
                <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: C.textMid, fontWeight: 600, fontSize: 12, borderBottom: `1px solid ${C.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...bio].reverse().map((row, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: "10px 12px", color: C.textMid }}>{row.date}</td>
                <td style={{ padding: "10px 12px", fontWeight: 600 }}>{row.poids}</td>
                <td style={{ padding: "10px 12px" }}>{row.imc}</td>
                <td style={{ padding: "10px 12px" }}>
                  <Badge color={row.imc < 25 ? "success" : "warning"}>{row.imc < 18.5 ? "Insuffisant" : row.imc < 25 ? "Normal" : row.imc < 30 ? "Surpoids" : "Obésité"}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {modal && (
        <Modal title="Nouvelle pesée" onClose={() => setModal(false)}>
          <FormField label="Poids (taille supposée : 1,74 m)" value={poids} onChange={setPoids} unit="kg" min={30} max={250} step={0.1} />
          {poids && (
            <div style={{ background: C.surfaceAlt, borderRadius: 10, padding: "12px 16px", marginBottom: 14, fontSize: 14, color: C.textMid }}>
              IMC calculé : <strong style={{ color: C.primary }}>{calcIMC(+poids)}</strong> kg/m²
            </div>
          )}
          <SubmitBtn onClick={save}>Enregistrer</SubmitBtn>
        </Modal>
      )}
    </div>
  );
}

// Activity
function ActivityPage({ activity, setActivity }) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ pas: "", dist: "", cal: "" });
  const [saved, setSaved] = useState(false);

  const save = async () => {
    if (!form.pas) return;
    const token = localStorage.getItem("token");
    const payload = { pas: +form.pas, dist: +form.dist || 0, cal: +form.cal || 0 };
    const response = await axios.post(`${API_BASE}/patient/activity`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = response.data;

    setActivity(a => [...a, { date: toDateLabel(data.measure_date), pas: data.pas, dist: Number(data.dist), cal: data.cal }]);
    setModal(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setForm({ pas: "", dist: "", cal: "" });
  };

  const last = activity[activity.length - 1] || { pas: 0, dist: 0, cal: 0 };
  const goalPas = 10000;

  return (
    <div>
      <SectionTitle sub="Suivi de votre activité physique quotidienne">Activité physique</SectionTitle>
      {saved && <div style={{ background: "#EAFAF1", border: "1px solid #A9DFBF", borderRadius: 10, padding: "10px 16px", marginBottom: 16, color: "#1E8449", fontSize: 14 }}>✅ Activité enregistrée !</div>}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 18 }}>
        <button onClick={() => setModal(true)} style={{ background: C.primary, color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          + Enregistrer activité
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
        <MetricTile label="Pas aujourd'hui" value={last.pas.toLocaleString("fr")} unit={`/ ${goalPas.toLocaleString("fr")}`} icon="🦶" status={last.pas >= goalPas ? "normal" : "warning"} />
        <MetricTile label="Distance" value={last.dist} unit="km" icon="📍" status="normal" />
        <MetricTile label="Calories brûlées" value={last.cal} unit="kcal" icon="🔥" status="normal" />
      </div>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: C.primaryDark }}>Progression — objectif 10 000 pas</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: last.pas >= goalPas ? C.accent : C.warning }}>{pct(last.pas, goalPas)}%</span>
        </div>
        <div style={{ background: C.border, borderRadius: 8, height: 12 }}>
          <div style={{ width: `${pct(last.pas, goalPas)}%`, height: 12, background: last.pas >= goalPas ? C.accent : C.primary, borderRadius: 8, transition: "width 0.6s" }} />
        </div>
        {last.pas >= goalPas && <div style={{ marginTop: 10, fontSize: 13, color: C.accent }}>🎉 Félicitations ! Objectif atteint aujourd'hui !</div>}
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.primaryDark, marginBottom: 14 }}>Pas sur 7 jours</div>
        <BarChart data={activity.slice(-7)} valueKey="pas" color={C.primary} />
      </Card>

      <Card>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.primaryDark, marginBottom: 14 }}>Historique</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: C.surfaceAlt }}>
              {["Date", "Pas", "Distance (km)", "Calories (kcal)", "Objectif"].map(h => (
                <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: C.textMid, fontWeight: 600, fontSize: 12, borderBottom: `1px solid ${C.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...activity].reverse().map((row, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: "10px 12px", color: C.textMid }}>{row.date}</td>
                <td style={{ padding: "10px 12px", fontWeight: 600 }}>{row.pas.toLocaleString("fr")}</td>
                <td style={{ padding: "10px 12px" }}>{row.dist}</td>
                <td style={{ padding: "10px 12px" }}>{row.cal}</td>
                <td style={{ padding: "10px 12px" }}><Badge color={row.pas >= 10000 ? "success" : "warning"}>{row.pas >= 10000 ? "Atteint" : "Partiel"}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {modal && (
        <Modal title="Enregistrer une activité" onClose={() => setModal(false)}>
          <FormField label="Nombre de pas" value={form.pas} onChange={v => setForm(f => ({ ...f, pas: v }))} unit="pas" min={0} max={50000} />
          <FormField label="Distance parcourue" value={form.dist} onChange={v => setForm(f => ({ ...f, dist: v }))} unit="km" min={0} max={100} step={0.1} />
          <FormField label="Calories brûlées" value={form.cal} onChange={v => setForm(f => ({ ...f, cal: v }))} unit="kcal" min={0} max={3000} />
          <SubmitBtn onClick={save}>Enregistrer</SubmitBtn>
        </Modal>
      )}
    </div>
  );
}

// Nutrition
function NutritionPage({ nutri, setNutri }) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ cal: "", qualite: "Bonne" });
  const [saved, setSaved] = useState(false);
  const goalCal = 2000;

  const save = async () => {
    if (!form.cal) return;
    const token = localStorage.getItem("token");
    const payload = { cal: +form.cal, qualite: form.qualite };
    const response = await axios.post(`${API_BASE}/patient/nutrition`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = response.data;

    setNutri(n => [...n, { date: toDateLabel(data.measure_date), cal: data.cal, qualite: data.qualite }]);
    setModal(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setForm({ cal: "", qualite: "Bonne" });
  };

  const last = nutri[nutri.length - 1] || { cal: 0, qualite: "Bonne" };
  const qualColor = { "Excellente": "success", "Bonne": "info", "Moyenne": "warning", "Mauvaise": "danger" };

  return (
    <div>
      <SectionTitle sub="Suivi de votre nutrition quotidienne">Habitudes alimentaires</SectionTitle>
      {saved && <div style={{ background: "#EAFAF1", border: "1px solid #A9DFBF", borderRadius: 10, padding: "10px 16px", marginBottom: 16, color: "#1E8449", fontSize: 14 }}>✅ Repas enregistré !</div>}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 18 }}>
        <button onClick={() => setModal(true)} style={{ background: C.primary, color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          + Enregistrer repas
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
        <MetricTile label="Calories aujourd'hui" value={last.cal} unit={`/ ${goalCal} kcal`} icon="🍽️" status={last.cal <= goalCal ? "normal" : "warning"} />
        <div style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 18px" }}>
          <div style={{ fontSize: 13, color: C.textMid, fontWeight: 500, marginBottom: 8 }}>Qualité nutritionnelle</div>
          <Badge color={qualColor[last.qualite] || "info"}>{last.qualite}</Badge>
        </div>
        <div style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 18px" }}>
          <div style={{ fontSize: 13, color: C.textMid, fontWeight: 500, marginBottom: 8 }}>Vs objectif</div>
          <div style={{ fontWeight: 700, fontSize: 22, color: last.cal <= goalCal ? C.accent : C.danger }}>
            {last.cal <= goalCal ? "-" : "+"}{Math.abs(last.cal - goalCal)} kcal
          </div>
        </div>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.primaryDark, marginBottom: 10 }}>Calories vs objectif 2000 kcal</div>
        <div style={{ background: C.border, borderRadius: 8, height: 10, marginBottom: 6 }}>
          <div style={{ width: `${Math.min(100, pct(last.cal, goalCal))}%`, height: 10, background: last.cal <= goalCal ? C.accent : C.danger, borderRadius: 8 }} />
        </div>
        <div style={{ fontSize: 13, color: C.textMid }}>{last.cal} kcal consommées sur {goalCal} kcal recommandées</div>
      </Card>

      <Card>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.primaryDark, marginBottom: 14 }}>Historique nutritionnel</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: C.surfaceAlt }}>
              {["Date", "Calories (kcal)", "Qualité", "Bilan"].map(h => (
                <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: C.textMid, fontWeight: 600, fontSize: 12, borderBottom: `1px solid ${C.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...nutri].reverse().map((row, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: "10px 12px", color: C.textMid }}>{row.date}</td>
                <td style={{ padding: "10px 12px", fontWeight: 600 }}>{row.cal}</td>
                <td style={{ padding: "10px 12px" }}><Badge color={qualColor[row.qualite] || "info"}>{row.qualite}</Badge></td>
                <td style={{ padding: "10px 12px", color: row.cal <= goalCal ? C.accent : C.danger, fontWeight: 600 }}>
                  {row.cal <= goalCal ? `−${goalCal - row.cal}` : `+${row.cal - goalCal}`} kcal
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {modal && (
        <Modal title="Enregistrer les repas" onClose={() => setModal(false)}>
          <FormField label="Calories totales consommées" value={form.cal} onChange={v => setForm(f => ({ ...f, cal: v }))} unit="kcal" min={0} max={5000} />
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: C.textMid, display: "block", marginBottom: 5 }}>Qualité nutritionnelle</label>
            <select value={form.qualite} onChange={e => setForm(f => ({ ...f, qualite: e.target.value }))}
              style={{ width: "100%", padding: "10px 12px", border: `1.5px solid ${C.borderMid}`, borderRadius: 10, fontSize: 15, color: C.text, background: C.surfaceAlt }}>
              {["Excellente", "Bonne", "Moyenne", "Mauvaise"].map(q => <option key={q}>{q}</option>)}
            </select>
          </div>
          <SubmitBtn onClick={save}>Enregistrer</SubmitBtn>
        </Modal>
      )}
    </div>
  );
}

// Pathology
function PathologyPage({ patho, setPatho }) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ glycemie: "", spo2: "" });
  const [saved, setSaved] = useState(false);

  const save = async () => {
    if (!form.glycemie || !form.spo2) return;
    const token = localStorage.getItem("token");
    const payload = { glycemie: +form.glycemie, spo2: +form.spo2 };
    const response = await axios.post(`${API_BASE}/patient/pathology`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = response.data;

    setPatho(p => [...p, { date: toDateLabel(data.measure_date), glycemie: Number(data.glycemie), spo2: data.spo2 }]);
    setModal(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setForm({ glycemie: "", spo2: "" });
  };

  const last = patho[patho.length - 1] || { glycemie: 0, spo2: 0 };
  const glyAlert = last.glycemie > 7 || (last.glycemie && last.glycemie < 3.9);
  const spo2Alert = last.spo2 < 95;

  return (
    <div>
      <SectionTitle sub="Surveillance des paramètres pathologiques chroniques">Données pathologiques</SectionTitle>
      {saved && <div style={{ background: "#EAFAF1", border: "1px solid #A9DFBF", borderRadius: 10, padding: "10px 16px", marginBottom: 16, color: "#1E8449", fontSize: 14 }}>✅ Données enregistrées !</div>}

      {(glyAlert || spo2Alert) && (
        <div style={{ background: "#FDEDEC", border: "1px solid #F1948A", borderRadius: 12, padding: "12px 18px", marginBottom: 18, display: "flex", gap: 10, alignItems: "flex-start" }}>
          <span style={{ fontSize: 20 }}>🚨</span>
          <div>
            <div style={{ fontWeight: 700, color: "#A93226", fontSize: 14 }}>Valeurs anormales détectées</div>
            {glyAlert && <div style={{ fontSize: 13, color: "#A93226", marginTop: 2 }}>Glycémie hors normes ({last.glycemie} mmol/L — norme : 3.9–7.0)</div>}
            {spo2Alert && <div style={{ fontSize: 13, color: "#A93226", marginTop: 2 }}>SpO2 critique ({last.spo2}% — seuil minimum : 95%)</div>}
            <div style={{ fontSize: 12, color: "#922B21", marginTop: 4 }}>Votre médecin a été notifié automatiquement.</div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 18 }}>
        <button onClick={() => setModal(true)} style={{ background: C.primary, color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          + Nouvelle mesure
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
        <MetricTile label="Glycémie" value={last.glycemie} unit="mmol/L" icon="🩸" status={!glyAlert ? "normal" : "danger"} />
        <MetricTile label="Saturation O₂ (SpO2)" value={`${last.spo2}%`} unit="" icon="🫁" status={!spo2Alert ? "normal" : "danger"} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <Card>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.primaryDark, marginBottom: 14 }}>Glycémie (mmol/L)</div>
          <BarChart data={patho} valueKey="glycemie" color="#E74C3C" />
          <div style={{ fontSize: 12, color: C.textLight, marginTop: 8 }}>Zone normale : 3.9 – 7.0 mmol/L</div>
        </Card>
        <Card>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.primaryDark, marginBottom: 14 }}>SpO2 (%)</div>
          <BarChart data={patho} valueKey="spo2" color={C.primary} />
          <div style={{ fontSize: 12, color: C.textLight, marginTop: 8 }}>Seuil minimum : 95%</div>
        </Card>
      </div>

      <Card>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.primaryDark, marginBottom: 14 }}>Historique</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: C.surfaceAlt }}>
              {["Date", "Glycémie (mmol/L)", "SpO2 (%)", "Statut glycémie", "Statut SpO2"].map(h => (
                <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: C.textMid, fontWeight: 600, fontSize: 12, borderBottom: `1px solid ${C.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...patho].reverse().map((row, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: "10px 12px", color: C.textMid }}>{row.date}</td>
                <td style={{ padding: "10px 12px", fontWeight: 600 }}>{row.glycemie}</td>
                <td style={{ padding: "10px 12px", fontWeight: 600 }}>{row.spo2}</td>
                <td style={{ padding: "10px 12px" }}><Badge color={row.glycemie >= 3.9 && row.glycemie <= 7 ? "success" : "danger"}>{row.glycemie >= 3.9 && row.glycemie <= 7 ? "Normal" : "Anormal"}</Badge></td>
                <td style={{ padding: "10px 12px" }}><Badge color={row.spo2 >= 95 ? "success" : "danger"}>{row.spo2 >= 95 ? "Normal" : "Critique"}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {modal && (
        <Modal title="Saisir les données pathologiques" onClose={() => setModal(false)}>
          <FormField label="Glycémie" value={form.glycemie} onChange={v => setForm(f => ({ ...f, glycemie: v }))} unit="mmol/L" min={1} max={30} step={0.1} />
          <FormField label="Saturation en oxygène (SpO2)" value={form.spo2} onChange={v => setForm(f => ({ ...f, spo2: v }))} unit="%" min={70} max={100} />
          <SubmitBtn onClick={save}>Enregistrer</SubmitBtn>
        </Modal>
      )}
    </div>
  );
}

// Goals
function GoalsPage({ goals, setGoals }) {
  const [modal, setModal] = useState(false);
  const [editGoal, setEditGoal] = useState(null);
  const [form, setForm] = useState({ type: "", cible: "", unite: "", periode: "Quotidien", icon: "🎯" });

  const openNew = () => {
    setEditGoal(null);
    setForm({ type: "", cible: "", unite: "", periode: "Quotidien", icon: "🎯" });
    setModal(true);
  };

  const openEdit = (g) => {
    setEditGoal(g);
    setForm({ type: g.type, cible: g.cible, unite: g.unite, periode: g.periode, icon: g.icon });
    setModal(true);
  };

  const save = async () => {
    if (!form.type || !form.cible) return;
    const token = localStorage.getItem("token");
    const payload = { ...form, cible: +form.cible, actuel: editGoal ? editGoal.actuel : 0 };

    if (editGoal) {
      const response = await axios.put(`${API_BASE}/patient/goals/${editGoal.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      setGoals(gs => gs.map(g => g.id === editGoal.id ? { ...g, ...data } : g));
    } else {
      const response = await axios.post(`${API_BASE}/patient/goals`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      setGoals(gs => [...gs, { ...data }]);
    }
    setModal(false);
  };

  const deleteGoal = async (id) => {
    const token = localStorage.getItem("token");
    await axios.delete(`${API_BASE}/patient/goals/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setGoals(gs => gs.filter(g => g.id !== id));
  };

  const total = goals.length;
  const atteints = goals.filter(g => pct(g.actuel, g.cible) >= 100).length;

  return (
    <div>
      <SectionTitle sub="Définissez et suivez vos objectifs de bien-être">Objectifs de santé</SectionTitle>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Objectifs actifs", val: total, icon: "🎯" },
          { label: "Objectifs atteints", val: atteints, icon: "✅" },
          { label: "Taux de réussite", val: `${total ? Math.round((atteints / total) * 100) : 0}%`, icon: "📈" },
        ].map((s, i) => (
          <div key={i} style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 20px" }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: C.text }}>{s.val}</div>
            <div style={{ fontSize: 13, color: C.textMid }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button onClick={openNew} style={{ background: C.primary, color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          + Nouvel objectif
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {goals.map(g => <GoalCard key={g.id} goal={g} onEdit={openEdit} onDelete={deleteGoal} />)}
        {goals.length === 0 && (
          <Card style={{ textAlign: "center", padding: "40px 24px", color: C.textLight }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🎯</div>
            <div style={{ fontSize: 15 }}>Aucun objectif défini. Commencez par en créer un !</div>
          </Card>
        )}
      </div>

      {modal && (
        <Modal title={editGoal ? "Modifier l'objectif" : "Créer un objectif"} onClose={() => setModal(false)}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: C.textMid, display: "block", marginBottom: 5 }}>Type d'objectif</label>
            <select value={form.type} onChange={e => {
              const presets = { "Pas quotidiens": { unite: "pas", icon: "🦶" }, "Eau": { unite: "L", icon: "💧" }, "Sommeil": { unite: "h", icon: "🌙" }, "Calories brûlées": { unite: "kcal", icon: "🔥" }, "Poids": { unite: "kg", icon: "⚖️" } };
              const p = presets[e.target.value] || {};
              setForm(f => ({ ...f, type: e.target.value, ...p }));
            }} style={{ width: "100%", padding: "10px 12px", border: `1.5px solid ${C.borderMid}`, borderRadius: 10, fontSize: 15, color: C.text, background: C.surfaceAlt }}>
              <option value="">Sélectionner...</option>
              {["Pas quotidiens", "Eau", "Sommeil", "Calories brûlées", "Poids"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <FormField label="Valeur cible" value={form.cible} onChange={v => setForm(f => ({ ...f, cible: v }))} unit={form.unite} min={0} max={100000} />
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: C.textMid, display: "block", marginBottom: 5 }}>Période</label>
            <select value={form.periode} onChange={e => setForm(f => ({ ...f, periode: e.target.value }))}
              style={{ width: "100%", padding: "10px 12px", border: `1.5px solid ${C.borderMid}`, borderRadius: 10, fontSize: 15, color: C.text, background: C.surfaceAlt }}>
              <option>Quotidien</option><option>Hebdomadaire</option>
            </select>
          </div>
          <SubmitBtn onClick={save}>{editGoal ? "Enregistrer les modifications" : "Créer l'objectif"}</SubmitBtn>
        </Modal>
      )}
    </div>
  );
}

// History
function HistoryPage({ vitals, bio, activity, patho, nutri }) {
  const [filter, setFilter] = useState("tous");

  const all = [
    ...vitals.map(d => ({ ...d, type: "Signes vitaux", desc: `FC: ${d.bpm} bpm · ${d.sys}/${d.dia} mmHg · ${d.temp}°C`, color: "#E74C3C", icon: "❤️" })),
    ...bio.map(d => ({ ...d, type: "Biométrie", desc: `Poids: ${d.poids} kg · IMC: ${d.imc}`, color: C.primary, icon: "⚖️" })),
    ...activity.map(d => ({ ...d, type: "Activité", desc: `${d.pas.toLocaleString("fr")} pas · ${d.dist} km · ${d.cal} kcal`, color: C.accent, icon: "🦶" })),
    ...patho.map(d => ({ ...d, type: "Pathologie", desc: `Glycémie: ${d.glycemie} mmol/L · SpO2: ${d.spo2}%`, color: C.warning, icon: "🩸" })),
    ...nutri.map(d => ({ ...d, type: "Nutrition", desc: `${d.cal} kcal · Qualité: ${d.qualite}`, color: "#9B59B6", icon: "🍽️" })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  const filtered = filter === "tous" ? all : all.filter(d => d.type === filter);

  const filterOpts = ["tous", "Signes vitaux", "Biométrie", "Activité", "Pathologie", "Nutrition"];

  return (
    <div>
      <SectionTitle sub="Consultez l'intégralité de vos mesures passées">Historique des données</SectionTitle>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {filterOpts.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: "8px 16px", borderRadius: 20, border: `1.5px solid ${filter === f ? C.primary : C.border}`, background: filter === f ? C.primary : "transparent", color: filter === f ? "#fff" : C.textMid, cursor: "pointer", fontSize: 13, fontWeight: filter === f ? 600 : 400 }}>
            {f === "tous" ? "Tous" : f}
          </button>
        ))}
      </div>

      <Card>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {filtered.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${item.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                {item.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: C.text }}>{item.type}</div>
                <div style={{ fontSize: 13, color: C.textMid, marginTop: 2 }}>{item.desc}</div>
              </div>
              <div style={{ fontSize: 13, color: C.textLight, whiteSpace: "nowrap" }}>{item.date}</div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: "30px 0", textAlign: "center", color: C.textLight, fontSize: 14 }}>Aucune donnée pour ce filtre</div>
          )}
        </div>
      </Card>
    </div>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { key: "dashboard", label: "Tableau de bord", icon: "🏠" },
  { key: "vitals", label: "Signes vitaux", icon: "❤️" },
  { key: "biometrics", label: "Biométrie", icon: "⚖️" },
  { key: "activity", label: "Activité", icon: "🦶" },
  { key: "nutrition", label: "Nutrition", icon: "🍽️" },
  { key: "pathology", label: "Pathologie", icon: "🩸" },
  { key: "goals", label: "Objectifs", icon: "🎯" },
  { key: "history", label: "Historique", icon: "📋" },
];

export default function EspacePatient({ section = "dashboard" }) {
  const [page, setPage] = useState(section);
  const [vitals, setVitals] = useState([]);
  const [bio, setBio] = useState([]);
  const [activity, setActivity] = useState([]);
  const [nutri, setNutri] = useState([]);
  const [patho, setPatho] = useState([]);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    if (section && section !== page) {
      setPage(section);
    }
  }, [section]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };
    const load = async () => {
      const [vitalsRes, bioRes, activityRes, nutriRes, pathoRes, goalsRes] = await Promise.all([
        axios.get(`${API_BASE}/patient/vitals`, { headers }),
        axios.get(`${API_BASE}/patient/biometrics`, { headers }),
        axios.get(`${API_BASE}/patient/activity`, { headers }),
        axios.get(`${API_BASE}/patient/nutrition`, { headers }),
        axios.get(`${API_BASE}/patient/pathology`, { headers }),
        axios.get(`${API_BASE}/patient/goals`, { headers }),
      ]);

      setVitals(vitalsRes.data.map(r => ({ date: toDateLabel(r.measure_date), bpm: r.bpm, sys: r.sys, dia: r.dia, temp: Number(r.temp) })));
      setBio(bioRes.data.map(r => ({ date: toDateLabel(r.measure_date), poids: Number(r.poids), imc: Number(r.imc) })));
      setActivity(activityRes.data.map(r => ({ date: toDateLabel(r.measure_date), pas: r.pas, dist: Number(r.dist), cal: r.cal })));
      setNutri(nutriRes.data.map(r => ({ date: toDateLabel(r.measure_date), cal: r.cal, qualite: r.qualite })));
      setPatho(pathoRes.data.map(r => ({ date: toDateLabel(r.measure_date), glycemie: Number(r.glycemie), spo2: r.spo2 })));
      setGoals(goalsRes.data.map(r => ({
        id: r.id,
        type: r.type,
        cible: Number(r.cible),
        actuel: Number(r.actuel),
        unite: r.unite || "",
        periode: r.periode,
        icon: r.icon || "🎯",
      })));
    };

    load();
  }, []);

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard vitals={vitals} bio={bio} activity={activity} goals={goals} />;
      case "vitals": return <VitalsPage vitals={vitals} setVitals={setVitals} />;
      case "biometrics": return <BiometricsPage bio={bio} setBio={setBio} />;
      case "activity": return <ActivityPage activity={activity} setActivity={setActivity} />;
      case "nutrition": return <NutritionPage nutri={nutri} setNutri={setNutri} />;
      case "pathology": return <PathologyPage patho={patho} setPatho={setPatho} />;
      case "goals": return <GoalsPage goals={goals} setGoals={setGoals} />;
      case "history": return <HistoryPage vitals={vitals} bio={bio} activity={activity} patho={patho} nutri={nutri} />;
      default: return null;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif", background: C.bg, color: C.text }}>
      <aside style={{ width: 240, background: C.surface, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", boxShadow: "2px 0 12px rgba(46,134,193,0.06)", flexShrink: 0 }}>
        <div style={{ padding: "24px 20px 20px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: C.primary, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 20 }}>🏥</span>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: C.primaryDark, letterSpacing: "-0.3px" }}>SantéApp</div>
              <div style={{ fontSize: 11, color: C.textLight }}>Espace Patient</div>
            </div>
          </div>
        </div>

        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, background: C.surfaceAlt }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: C.primaryDark }}>
              AM
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, color: C.text }}>Aymen Mabrouk</div>
              <div style={{ fontSize: 11, color: C.textLight }}>Patient #P-2024-001</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
          {NAV_ITEMS.map(item => {
            const active = page === item.key;
            return (
              <button key={item.key} onClick={() => setPage(item.key)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", marginBottom: 3, borderRadius: 10, border: "none", background: active ? `${C.primary}15` : "transparent", color: active ? C.primary : C.textMid, cursor: "pointer", textAlign: "left", fontWeight: active ? 700 : 400, fontSize: 14, transition: "all 0.15s" }}>
                <span style={{ fontSize: 17 }}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: "16px 20px", borderTop: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 11, color: C.textLight, marginBottom: 8 }}>Sprint 2 · Frontend React</div>
          <div style={{ display: "flex", gap: 4 }}>
            {["W", "F", "A", "C"].map((m, i) => (
              <div key={i} style={{ width: 26, height: 26, borderRadius: "50%", background: [C.primary, C.accent, C.warning, "#9B59B6"][i], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff" }}>{m}</div>
            ))}
          </div>
        </div>
      </aside>

      <main style={{ flex: 1, overflowY: "auto" }}>
        <header style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
          <div>
            <div style={{ fontSize: 13, color: C.textLight }}>Bienvenue,</div>
            <div style={{ fontWeight: 700, fontSize: 17, color: C.text }}>Aymen Mabrouk</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ fontSize: 13, color: C.textMid }}>
              {new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </div>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.accent, boxShadow: `0 0 0 3px ${C.accentLight}` }} title="Connecté" />
          </div>
        </header>

        <div style={{ padding: "28px 32px", maxWidth: 1100, margin: "0 auto" }}>
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
