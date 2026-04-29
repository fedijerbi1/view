import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { C } from "../theme/unifiedTheme";

const columns = [
  { name: "ID", selector: row => row.id, sortable: true },
  { name: "Nom", selector: row => row.nom, sortable: true },
  { name: "Email", selector: row => row.email, sortable: true },
  { name: "Role", selector: row => row.role, sortable: true },
  { name: "Telephone", selector: row => row.telephone, sortable: true },
  { name: "Date creation", selector: row => row.created_at, sortable: true },
  { name: "Last login", selector: row => row.lastlog, sortable: true },
];

function Card({ children, style = {} }) {
  return (
    <div style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, boxShadow: C.cardShadow, padding: "20px 24px", ...style }}>
      {children}
    </div>
  );
}

function SectionTitle({ children, sub }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.primaryDark, letterSpacing: "-0.3px" }}>{children}</h2>
      {sub && <p style={{ margin: "4px 0 0", fontSize: 13, color: C.textMid }}>{sub}</p>}
    </div>
  );
}

function StatTile({ label, value, accent }) {
  return (
    <div style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 18px" }}>
      <div style={{ fontSize: 12, color: C.textLight }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: accent }}>{value}</div>
    </div>
  );
}

export default function Espaceadmin({ section = "dashboard" }) {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    total_users: 0,
    total_admins: 0,
    total_medecins: 0,
    active_30_days: 0,
    new_this_month: 0,
  });

  const swalTheme = {
    background: C.surface,
    color: C.text,
    confirmButtonColor: C.primary,
    iconColor: C.primary,
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/");
          return;
        }

        const [usersResponse, statsResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/users/stats", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUsers(usersResponse.data || []);
        setStats(statsResponse.data || {});
      } catch (error) {
        Swal.fire({
          title: "Erreur",
          text: "Erreur lors de la recuperation des donnees",
          icon: "error",
          ...swalTheme,
        });
      }
    };

    fetchUsers();
  }, [navigate]);

  const chartData = useMemo(() => {
    const total = stats.total_users || 1;

    return {
      adminsPercent: Math.round(((stats.total_admins || 0) / total) * 100),
      medecinsPercent: Math.round(((stats.total_medecins || 0) / total) * 100),
      actifsPercent: Math.round(((stats.active_30_days || 0) / total) * 100),
    };
  }, [stats]);

  const barChartData = useMemo(() => (
    [
      { name: "Admins", value: stats.total_admins || 0 },
      { name: "Medecins", value: stats.total_medecins || 0 },
      { name: "Actifs 30j", value: stats.active_30_days || 0 },
      { name: "Nouveaux mois", value: stats.new_this_month || 0 },
    ]
  ), [stats]);

  const pieChartData = useMemo(() => {
    const admin = stats.total_admins || 0;
    const medecin = stats.total_medecins || 0;
    const other = Math.max((stats.total_users || 0) - admin - medecin, 0);

    return [
      { name: "Admins", value: admin, color: C.warning },
      { name: "Medecins", value: medecin, color: C.accent },
      { name: "Autres", value: other, color: "#95A5A6" },
    ];
  }, [stats]);

  const tableStyles = {
    rows: { style: { minHeight: "46px" } },
    headCells: { style: { background: C.surfaceAlt, fontWeight: 700, color: C.textMid, textTransform: "uppercase", fontSize: 11 } },
    cells: { style: { color: C.text } },
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: C.text }}>Espace Admin</h1>
          <p style={{ margin: "6px 0 0", color: C.textMid }}>Supervision des comptes et indicateurs globaux.</p>
        </div>
        <Link to="/create_medecin" style={{ background: C.primary, color: "#fff", padding: "10px 16px", borderRadius: 12, textDecoration: "none", fontWeight: 600, boxShadow: C.cardShadow }}>
          Creer un medecin
        </Link>
      </div>

      {(section === "dashboard" || section === "stats") && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          <StatTile label="Total utilisateurs" value={stats.total_users} accent={C.primary} />
          <StatTile label="Medecins" value={stats.total_medecins} accent={C.accent} />
          <StatTile label="Admins" value={stats.total_admins} accent={C.warning} />
          <StatTile label="Actifs 30 jours" value={stats.active_30_days} accent={C.primaryDark} />
        </div>
      )}

      {section === "dashboard" && (
        <Card>
          <SectionTitle sub="Actions rapides et vue globale">Tableau de bord Admin</SectionTitle>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div style={{ background: C.surfaceAlt, borderRadius: 12, padding: "16px 18px", minWidth: 220 }}>
              <div style={{ fontSize: 12, color: C.textLight, marginBottom: 8 }}>Nouveaux utilisateurs ce mois</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: C.text }}>{stats.new_this_month || 0}</div>
            </div>
            <div style={{ background: C.surfaceAlt, borderRadius: 12, padding: "16px 18px", minWidth: 220 }}>
              <div style={{ fontSize: 12, color: C.textLight, marginBottom: 8 }}>Acces actifs</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: C.text }}>{stats.active_30_days || 0}</div>
            </div>
          </div>
        </Card>
      )}

      {(section === "dashboard" || section === "stats") && (
        <Card>
          <SectionTitle sub="Roles et activite">Statistiques generales</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Indicateurs principaux</div>
              <div style={{ width: "100%", height: 280 }}>
                <ResponsiveContainer>
                  <BarChart data={barChartData}>
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill={C.primary} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Repartition des roles</div>
              <div style={{ width: "100%", height: 280 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                      {pieChartData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 16 }}>
            <div style={{ background: C.surfaceAlt, padding: "10px 12px", borderRadius: 10, boxShadow: C.cardShadow }}>Admins: {chartData.adminsPercent}%</div>
            <div style={{ background: C.surfaceAlt, padding: "10px 12px", borderRadius: 10, boxShadow: C.cardShadow }}>Medecins: {chartData.medecinsPercent}%</div>
            <div style={{ background: C.surfaceAlt, padding: "10px 12px", borderRadius: 10, boxShadow: C.cardShadow }}>Actifs 30j: {chartData.actifsPercent}%</div>
          </div>
        </Card>
      )}

      {section === "users" && (
        <Card>
          <SectionTitle sub="Liste, recherche et suivi des comptes">Gestion utilisateurs</SectionTitle>
          <DataTable columns={columns} data={users} pagination customStyles={tableStyles} />
        </Card>
      )}
    </div>
  );
}
