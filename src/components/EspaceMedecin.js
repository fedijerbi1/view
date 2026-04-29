import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { C } from "../theme/unifiedTheme";

const API_BASE = "http://localhost:5000/api";

const consultationTrend = [
  { day: "Lun", visites: 8, messages: 12, prescriptions: 5 },
  { day: "Mar", visites: 10, messages: 9, prescriptions: 6 },
  { day: "Mer", visites: 12, messages: 14, prescriptions: 7 },
  { day: "Jeu", visites: 9, messages: 8, prescriptions: 4 },
  { day: "Ven", visites: 14, messages: 16, prescriptions: 9 },
  { day: "Sam", visites: 7, messages: 5, prescriptions: 3 },
];

const formatDate = (dateValue) => {
  if (!dateValue) return "";
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.valueOf())) return "";
  return parsed.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const daysSince = (dateValue) => {
  if (!dateValue) return null;
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.valueOf())) return null;
  return Math.round((Date.now() - parsed.getTime()) / 86400000);
};

const riskLevel = (bpm, glycemie) => {
  if ((bpm && bpm >= 95) || (glycemie && glycemie >= 7)) return "Élevé";
  if ((bpm && bpm >= 85) || (glycemie && glycemie >= 6.1)) return "Moyen";
  return "Faible";
};

const riskColor = (risk) => {
  if (risk === "Élevé") return "danger";
  if (risk === "Moyen") return "warning";
  return "success";
};

function Badge({ color, children }) {
  const colors = {
    success: { bg: "#d1fae5", text: "#065f46" },
    warning: { bg: "#fef3c7", text: "#92400e" },
    danger: { bg: "#fee2e2", text: "#7f1d1d" },
    info: { bg: "#dbeafe", text: "#1e40af" },
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

function StatTile({ label, value, hint, icon }) {
  return (
    <div style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, color: C.textMid, fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 18 }}>{icon}</span>
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: C.text }}>{value}</div>
      <div style={{ fontSize: 12, color: C.textLight }}>{hint}</div>
    </div>
  );
}

function BarChart({ data, valueKey, color }) {
  const maxVal = Math.max(1, ...data.map(d => d[valueKey])) * 1.1;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 120 }}>
      {data.map((d, i) => {
        const h = Math.round((d[valueKey] / maxVal) * 100);
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ fontSize: 11, color: C.textLight }}>{d[valueKey]}</div>
            <div style={{ width: "100%", height: h, background: color, borderRadius: "6px 6px 0 0" }} />
            <div style={{ fontSize: 11, color: C.textMid }}>{d.day}</div>
          </div>
        );
      })}
    </div>
  );
}

export default function EspaceMedecin({ section = "dashboard" }) {
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [overview, setOverview] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const swalTheme = {
    background: C.surface,
    color: C.text,
    confirmButtonColor: C.primary,
    iconColor: C.primary,
  };

  const [prescriptionForm, setPrescriptionForm] = useState({ patientId: "", medicine: "", dosage: "", duration: "", notes: "" });
  const [messageForm, setMessageForm] = useState({ patientId: "", subject: "", body: "" });
  const [reportForm, setReportForm] = useState({ patientId: "", period: "Hebdomadaire", focus: "Cardio", summary: "" });

  const token = localStorage.getItem("token");
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  useEffect(() => {
    if (!token) return;

    const load = async () => {
      setLoading(true);
      try {
        const [patientsRes, prescriptionsRes, messagesRes, reportsRes] = await Promise.all([
          axios.get(`${API_BASE}/medecin/patients`, { headers }),
          axios.get(`${API_BASE}/medecin/prescriptions`, { headers }),
          axios.get(`${API_BASE}/medecin/messages`, { headers }),
          axios.get(`${API_BASE}/medecin/reports`, { headers }),
        ]);

        setPatients(patientsRes.data || []);
        setPrescriptions(prescriptionsRes.data || []);
        setMessages(messagesRes.data || []);
        setReports(reportsRes.data || []);

        if ((patientsRes.data || []).length && !selectedPatientId) {
          const firstId = patientsRes.data[0].id;
          setSelectedPatientId(firstId);
          setPrescriptionForm((prev) => ({ ...prev, patientId: firstId }));
          setMessageForm((prev) => ({ ...prev, patientId: firstId }));
          setReportForm((prev) => ({ ...prev, patientId: firstId }));
        }
      } catch (error) {
        Swal.fire({
          title: "Erreur",
          text: "Impossible de charger les donnees medecin.",
          icon: "error",
          ...swalTheme,
        });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [headers, token]);

  useEffect(() => {
    if (!token || !selectedPatientId) return;

    const loadOverview = async () => {
      const response = await axios.get(`${API_BASE}/medecin/patients/${selectedPatientId}/overview`, { headers });
      setOverview(response.data || null);
    };

    loadOverview();
  }, [headers, selectedPatientId, token]);

  const patientOptions = useMemo(() => (
    patients.map((p) => ({
      ...p,
      risk: riskLevel(p.last_bpm, p.last_glycemie),
      status: daysSince(p.last_visit) !== null && daysSince(p.last_visit) <= 30 ? "Suivi actif" : "RDV requis",
    }))
  ), [patients]);

  const dashboardStats = [
    { label: "Patients suivis", value: patients.length, hint: "Dossiers actifs", icon: "🧑‍⚕️" },
    { label: "Prescriptions", value: prescriptions.length, hint: "En cours", icon: "🧾" },
    { label: "Messages", value: messages.length, hint: "A traiter", icon: "💬" },
    { label: "Rapports", value: reports.length, hint: "Generes", icon: "📄" },
  ];

  const handlePrescriptionSubmit = async () => {
    if (!prescriptionForm.patientId || !prescriptionForm.medicine) {
      await Swal.fire({
        title: "Champs requis",
        text: "Veuillez choisir un patient et un medicament.",
        icon: "warning",
        ...swalTheme,
      });
      return;
    }
    try {
      const response = await axios.post(`${API_BASE}/medecin/prescriptions`, prescriptionForm, { headers });
      setPrescriptions((current) => [response.data, ...current]);
      setPrescriptionForm((prev) => ({ ...prev, medicine: "", dosage: "", duration: "", notes: "" }));
      await Swal.fire({
        title: "Prescription ajoutee",
        text: "La prescription a ete enregistree.",
        icon: "success",
        ...swalTheme,
      });
    } catch (error) {
      Swal.fire({
        title: "Erreur",
        text: "Impossible d'enregistrer la prescription.",
        icon: "error",
        ...swalTheme,
      });
    }
  };

  const handleSelectPatient = (patientId) => {
    setSelectedPatientId(patientId);
    setPrescriptionForm((prev) => ({ ...prev, patientId }));
    setMessageForm((prev) => ({ ...prev, patientId }));
    setReportForm((prev) => ({ ...prev, patientId }));
  };

  const handleMessageSubmit = async () => {
    if (!messageForm.patientId || !messageForm.subject || !messageForm.body) {
      await Swal.fire({
        title: "Champs requis",
        text: "Veuillez saisir un objet et un message.",
        icon: "warning",
        ...swalTheme,
      });
      return;
    }
    try {
      const response = await axios.post(`${API_BASE}/medecin/messages`, messageForm, { headers });
      setMessages((current) => [response.data, ...current]);
      setMessageForm((prev) => ({ ...prev, subject: "", body: "" }));
      await Swal.fire({
        title: "Message envoye",
        text: "Le message a ete transmis au patient.",
        icon: "success",
        ...swalTheme,
      });
    } catch (error) {
      Swal.fire({
        title: "Erreur",
        text: "Impossible d'envoyer le message.",
        icon: "error",
        ...swalTheme,
      });
    }
  };

  const handleReportSubmit = async () => {
    if (!reportForm.period || !reportForm.focus) {
      await Swal.fire({
        title: "Champs requis",
        text: "Veuillez choisir une periode et un focus.",
        icon: "warning",
        ...swalTheme,
      });
      return;
    }
    try {
      const response = await axios.post(`${API_BASE}/medecin/reports`, reportForm, { headers });
      setReports((current) => [response.data, ...current]);
      setReportForm((prev) => ({ ...prev, summary: "" }));
      await Swal.fire({
        title: "Rapport genere",
        text: "Le rapport a ete ajoute a l'historique.",
        icon: "success",
        ...swalTheme,
      });
    } catch (error) {
      Swal.fire({
        title: "Erreur",
        text: "Impossible de generer le rapport.",
        icon: "error",
        ...swalTheme,
      });
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: C.text }}>Espace Medecin</h1>
          <p style={{ margin: "6px 0 0", color: C.textMid }}>Pilotage des patients, prescriptions et communications cliniques.</p>
        </div>
        <Badge color="info">Acces securise</Badge>
      </div>

      {section === "dashboard" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {dashboardStats.map((stat) => (
              <StatTile key={stat.label} {...stat} />
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
            <Card>
              <SectionTitle sub="Consultations, messages et prescriptions">Activite medicale</SectionTitle>
              <BarChart data={consultationTrend} valueKey="visites" color={C.primary} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 16 }}>
                <div style={{ background: C.surfaceAlt, borderRadius: 10, padding: "10px 12px" }}>
                  <div style={{ fontSize: 12, color: C.textLight }}>Messages</div>
                  <div style={{ fontWeight: 700 }}>{messages.length}</div>
                </div>
                <div style={{ background: C.surfaceAlt, borderRadius: 10, padding: "10px 12px" }}>
                  <div style={{ fontSize: 12, color: C.textLight }}>Prescriptions</div>
                  <div style={{ fontWeight: 700 }}>{prescriptions.length}</div>
                </div>
                <div style={{ background: C.surfaceAlt, borderRadius: 10, padding: "10px 12px" }}>
                  <div style={{ fontSize: 12, color: C.textLight }}>Rapports</div>
                  <div style={{ fontWeight: 700 }}>{reports.length}</div>
                </div>
              </div>
            </Card>

            <Card>
              <SectionTitle sub="Patients prioritaires">Alertes cliniques</SectionTitle>
              {patientOptions.slice(0, 4).map((p) => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{p.prenom} {p.nom}</div>
                    <div style={{ fontSize: 12, color: C.textLight }}>Dernier controle: {formatDate(p.last_visit) || "N/A"}</div>
                  </div>
                  <Badge color={riskColor(p.risk)}>{p.risk}</Badge>
                </div>
              ))}
              {patientOptions.length === 0 && (
                <div style={{ fontSize: 13, color: C.textLight }}>Aucun patient attribue.</div>
              )}
            </Card>
          </div>
        </>
      )}

      {section === "patients" && (
        <Card>
          <SectionTitle sub="Filtrer, suivre et mettre a jour les dossiers">Liste des patients</SectionTitle>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: C.surfaceAlt }}>
                {["Patient", "Age", "Risque", "Derniere visite", "Statut", "Action"].map((h) => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 12, color: C.textMid, borderBottom: `1px solid ${C.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {patientOptions.map((patient) => (
                <tr key={patient.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "10px 12px", fontWeight: 600 }}>{patient.prenom} {patient.nom}</td>
                  <td style={{ padding: "10px 12px" }}>{patient.age || "--"}</td>
                  <td style={{ padding: "10px 12px" }}><Badge color={riskColor(patient.risk)}>{patient.risk}</Badge></td>
                  <td style={{ padding: "10px 12px" }}>{formatDate(patient.last_visit) || "--"}</td>
                  <td style={{ padding: "10px 12px" }}>{patient.status}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <button onClick={() => handleSelectPatient(patient.id)} style={{ padding: "6px 10px", borderRadius: 8, border: "none", background: C.surface, cursor: "pointer", marginRight: 6, boxShadow: C.cardShadow, color: C.text }}>Ouvrir</button>
                    <button style={{ padding: "6px 10px", borderRadius: 8, border: "none", background: C.primary, color: "#fff", cursor: "pointer", boxShadow: C.cardShadow }}>Planifier</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {section === "dossier" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 16 }}>
          <Card>
            <SectionTitle sub="Selectionner un patient">Patient suivi</SectionTitle>
            {patientOptions.map((patient) => (
              <button key={patient.id} onClick={() => handleSelectPatient(patient.id)}
                style={{ width: "100%", textAlign: "left", padding: "10px 12px", borderRadius: 10, border: `1px solid ${selectedPatientId === patient.id ? C.primary : C.border}`, background: selectedPatientId === patient.id ? `${C.primary}12` : "transparent", marginBottom: 8, cursor: "pointer" }}>
                <div style={{ fontWeight: 600 }}>{patient.prenom} {patient.nom}</div>
                <div style={{ fontSize: 12, color: C.textLight }}>{patient.status} · {patient.risk}</div>
              </button>
            ))}
            {patientOptions.length === 0 && (
              <div style={{ fontSize: 13, color: C.textLight }}>Aucun patient attribue.</div>
            )}
          </Card>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card>
              <SectionTitle sub="Synthese clinique">Dossier patient</SectionTitle>
              {loading && <div style={{ color: C.textLight }}>Chargement...</div>}
              {!loading && !overview && <div style={{ color: C.textLight }}>Selectionnez un patient.</div>}
              {overview && (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{overview.patient.prenom} {overview.patient.nom}</div>
                      <div style={{ fontSize: 12, color: C.textLight }}>Age: {overview.patient.age || "--"} · Tel: {overview.patient.telephone || "--"}</div>
                    </div>
                    <Badge color={riskColor(riskLevel(overview.vitals?.bpm, overview.pathology?.glycemie))}>Risque {riskLevel(overview.vitals?.bpm, overview.pathology?.glycemie)}</Badge>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                    <div style={{ background: C.surfaceAlt, borderRadius: 10, padding: "10px 12px" }}>
                      <div style={{ fontSize: 12, color: C.textLight }}>Derniere visite</div>
                      <div style={{ fontWeight: 700 }}>{formatDate(overview.vitals?.measure_date) || "--"}</div>
                    </div>
                    <div style={{ background: C.surfaceAlt, borderRadius: 10, padding: "10px 12px" }}>
                      <div style={{ fontSize: 12, color: C.textLight }}>IMC</div>
                      <div style={{ fontWeight: 700 }}>{overview.biometrics?.imc || "--"}</div>
                    </div>
                    <div style={{ background: C.surfaceAlt, borderRadius: 10, padding: "10px 12px" }}>
                      <div style={{ fontSize: 12, color: C.textLight }}>SpO2</div>
                      <div style={{ fontWeight: 700 }}>{overview.pathology?.spo2 || "--"}%</div>
                    </div>
                  </div>
                </>
              )}
            </Card>

            <Card>
              <SectionTitle sub="Dernieres mesures">Indicateurs cles</SectionTitle>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {[
                  { label: "FC", value: overview?.vitals?.bpm || "--", unit: "bpm" },
                  { label: "TA", value: overview?.vitals ? `${overview.vitals.sys}/${overview.vitals.dia}` : "--", unit: "mmHg" },
                  { label: "Temperature", value: overview?.vitals?.temp || "--", unit: "°C" },
                  { label: "Poids", value: overview?.biometrics?.poids || "--", unit: "kg" },
                  { label: "Glycemie", value: overview?.pathology?.glycemie || "--", unit: "mmol/L" },
                  { label: "SpO2", value: overview?.pathology?.spo2 || "--", unit: "%" },
                ].map((item) => (
                  <div key={item.label} style={{ background: C.surfaceAlt, borderRadius: 10, padding: "10px 12px" }}>
                    <div style={{ fontSize: 12, color: C.textLight }}>{item.label}</div>
                    <div style={{ fontWeight: 700 }}>{item.value} {item.unit}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {section === "prescriptions" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 16 }}>
          <Card>
            <SectionTitle sub="Nouvelle prescription">Creer une ordonnance</SectionTitle>
            <label style={{ fontSize: 12, color: C.textLight }}>Patient</label>
            <select value={prescriptionForm.patientId} onChange={(e) => setPrescriptionForm((prev) => ({ ...prev, patientId: e.target.value }))}
              style={{ width: "100%", padding: "10px 12px", border: "none", borderRadius: 10, marginBottom: 12, background: C.surface, boxShadow: C.insetShadow }}>
              {patientOptions.map((p) => (
                <option key={p.id} value={p.id}>{p.prenom} {p.nom}</option>
              ))}
            </select>
            <input value={prescriptionForm.medicine} onChange={(e) => setPrescriptionForm((prev) => ({ ...prev, medicine: e.target.value }))}
              placeholder="Medicament" style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "none", marginBottom: 12, background: C.surface, boxShadow: C.insetShadow }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <input value={prescriptionForm.dosage} onChange={(e) => setPrescriptionForm((prev) => ({ ...prev, dosage: e.target.value }))}
                placeholder="Dosage" style={{ padding: "10px 12px", borderRadius: 10, border: "none", background: C.surface, boxShadow: C.insetShadow }} />
              <input value={prescriptionForm.duration} onChange={(e) => setPrescriptionForm((prev) => ({ ...prev, duration: e.target.value }))}
                placeholder="Duree" style={{ padding: "10px 12px", borderRadius: 10, border: "none", background: C.surface, boxShadow: C.insetShadow }} />
            </div>
            <textarea value={prescriptionForm.notes} onChange={(e) => setPrescriptionForm((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Notes cliniques" rows={3} style={{ width: "100%", marginTop: 12, padding: "10px 12px", borderRadius: 10, border: "none", background: C.surface, boxShadow: C.insetShadow }} />
            <button onClick={handlePrescriptionSubmit} style={{ width: "100%", marginTop: 12, padding: "12px", borderRadius: 12, border: "none", background: C.primary, color: "#fff", fontWeight: 700, cursor: "pointer", boxShadow: C.cardShadow }}>
              Valider la prescription
            </button>
          </Card>

          <Card>
            <SectionTitle sub="Ordonnances recentes">Historique</SectionTitle>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: C.surfaceAlt }}>
                  {["Patient", "Medicament", "Dosage", "Duree"].map((h) => (
                    <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 12, color: C.textMid, borderBottom: `1px solid ${C.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {prescriptions.map((item) => (
                  <tr key={item.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "10px 12px" }}>{item.patient_label || item.patient_name || "--"}</td>
                    <td style={{ padding: "10px 12px", fontWeight: 600 }}>{item.medicine}</td>
                    <td style={{ padding: "10px 12px" }}>{item.dosage || "--"}</td>
                    <td style={{ padding: "10px 12px" }}>{item.duration || "--"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {section === "communication" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 16 }}>
          <Card>
            <SectionTitle sub="Nouveau message">Messagerie patient</SectionTitle>
            <label style={{ fontSize: 12, color: C.textLight }}>Patient</label>
            <select value={messageForm.patientId} onChange={(e) => setMessageForm((prev) => ({ ...prev, patientId: e.target.value }))}
              style={{ width: "100%", padding: "10px 12px", border: "none", borderRadius: 10, marginBottom: 12, background: C.surfaceAlt, boxShadow: C.insetShadow }}>
              {patientOptions.map((p) => (
                <option key={p.id} value={p.id}>{p.prenom} {p.nom}</option>
              ))}
            </select>
            <input value={messageForm.subject} onChange={(e) => setMessageForm((prev) => ({ ...prev, subject: e.target.value }))}
              placeholder="Objet" style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "none", marginBottom: 12, background: C.surfaceAlt, boxShadow: C.insetShadow }} />
            <textarea value={messageForm.body} onChange={(e) => setMessageForm((prev) => ({ ...prev, body: e.target.value }))}
              placeholder="Contenu du message" rows={6} style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "none", background: C.surfaceAlt, boxShadow: C.insetShadow }} />
            <button onClick={handleMessageSubmit} style={{ width: "100%", marginTop: 12, padding: "12px", borderRadius: 12, border: "none", background: C.primary, color: "#fff", fontWeight: 700, cursor: "pointer", boxShadow: C.cardShadow }}>
              Envoyer
            </button>
          </Card>

          <Card>
            <SectionTitle sub="Messages recents">Suivi des demandes</SectionTitle>
            {messages.map((message) => (
              <div key={message.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{message.patient_label || message.patient_name || "--"}</div>
                  <div style={{ fontSize: 12, color: C.textLight }}>{message.subject}</div>
                </div>
                <Badge color={message.status === "replied" ? "success" : message.status === "sent" ? "info" : "warning"}>{message.status}</Badge>
              </div>
            ))}
            {messages.length === 0 && (
              <div style={{ fontSize: 13, color: C.textLight }}>Aucun message pour le moment.</div>
            )}
          </Card>
        </div>
      )}

      {section === "rapports" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 16 }}>
          <Card>
            <SectionTitle sub="Generer un rapport">Synthese medicale</SectionTitle>
            <label style={{ fontSize: 12, color: C.textLight }}>Patient</label>
            <select value={reportForm.patientId} onChange={(e) => setReportForm((prev) => ({ ...prev, patientId: e.target.value }))}
              style={{ width: "100%", padding: "10px 12px", border: "none", borderRadius: 10, marginBottom: 12, background: C.surfaceAlt, boxShadow: C.insetShadow }}>
              <option value="">Tous les patients</option>
              {patientOptions.map((p) => (
                <option key={p.id} value={p.id}>{p.prenom} {p.nom}</option>
              ))}
            </select>
            <label style={{ fontSize: 12, color: C.textLight }}>Periode</label>
            <select value={reportForm.period} onChange={(e) => setReportForm((prev) => ({ ...prev, period: e.target.value }))}
              style={{ width: "100%", padding: "10px 12px", border: "none", borderRadius: 10, marginBottom: 12, background: C.surfaceAlt, boxShadow: C.insetShadow }}>
              {"Hebdomadaire Mensuel Trimestriel".split(" ").map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
            <label style={{ fontSize: 12, color: C.textLight }}>Focus</label>
            <select value={reportForm.focus} onChange={(e) => setReportForm((prev) => ({ ...prev, focus: e.target.value }))}
              style={{ width: "100%", padding: "10px 12px", border: "none", borderRadius: 10, marginBottom: 12, background: C.surfaceAlt, boxShadow: C.insetShadow }}>
              {"Cardio Diabete Respiratoire".split(" ").map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
            <textarea value={reportForm.summary} onChange={(e) => setReportForm((prev) => ({ ...prev, summary: e.target.value }))}
              placeholder="Notes de synthese" rows={4} style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "none", background: C.surfaceAlt, boxShadow: C.insetShadow }} />
            <button onClick={handleReportSubmit} style={{ width: "100%", marginTop: 12, padding: "12px", borderRadius: 12, border: "none", background: C.primary, color: "#fff", fontWeight: 700, cursor: "pointer", boxShadow: C.cardShadow }}>
              Generer le rapport
            </button>
          </Card>

          <Card>
            <SectionTitle sub="Rapports disponibles">Historique</SectionTitle>
            {reports.map((report) => (
              <div key={report.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{report.focus} · {report.period}</div>
                  <div style={{ fontSize: 12, color: C.textLight }}>{formatDate(report.created_at)}</div>
                </div>
                <Badge color="info">Pret</Badge>
              </div>
            ))}
            {reports.length === 0 && (
              <div style={{ fontSize: 13, color: C.textLight }}>Aucun rapport genere.</div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
