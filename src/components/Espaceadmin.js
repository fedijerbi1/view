import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios'; 
import DataTable from 'react-data-table-component'; 
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
 const columns = [ 
{ name:"id" , selector: row => row.id, sortable: true },
  { name: "Nom", selector: row => row.nom, sortable: true },
  { name: "Email", selector: row => row.email, sortable: true },
 { name: "role", selector: row => row.role, sortable: true }, 
  { name: "Téléphone", selector: row => row.telephone, sortable: true },
  { name: "Date de creation ", selector: row => row.created_at, sortable: true }, 
  {name:"last login ", selector: row => row.lastlog, sortable: true },
]; 


export default function Espaceadmin ({ section = 'dashboard' }) {
const navigate = useNavigate();

const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
};  
const [users, setUsers] = useState([]);
const [stats, setStats] = useState({
  total_users: 0,
  total_admins: 0,
  total_medecins: 0,
  active_30_days: 0,
  new_this_month: 0,
});

useEffect (()=>{
const fetchUsers = async ()=> { 
    try { 
        const token = localStorage.getItem ('token');  
        if (!token) {
            navigate('/');
            return;
        }

const [usersResponse, statsResponse] = await Promise.all([
  axios.get("http://localhost:5000/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
  axios.get("http://localhost:5000/api/users/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
]);

        setUsers(usersResponse.data || []);
        setStats(statsResponse.data || {});


} 
catch (error) { 
Swal.fire ("error" , 'Erreur lors de la récupération des données', 'error') ; 
}
}
fetchUsers() ; 




},[navigate]);

const chartData = useMemo(() => {
  const total = stats.total_users || 1;

  return {
    adminsPercent: Math.round(((stats.total_admins || 0) / total) * 100),
    medecinsPercent: Math.round(((stats.total_medecins || 0) / total) * 100),
    actifsPercent: Math.round(((stats.active_30_days || 0) / total) * 100),
  };
}, [stats]);

const barChartData = useMemo(() => {
  return [
    { name: 'Admins', value: stats.total_admins || 0 },
    { name: 'Medecins', value: stats.total_medecins || 0 },
    { name: 'Actifs 30j', value: stats.active_30_days || 0 },
    { name: 'Nouveaux mois', value: stats.new_this_month || 0 },
  ];
}, [stats]);

const pieChartData = useMemo(() => {
  const admin = stats.total_admins || 0;
  const medecin = stats.total_medecins || 0;
  const other = Math.max((stats.total_users || 0) - admin - medecin, 0);

  return [
    { name: 'Admins', value: admin, color: '#ffc107' },
    { name: 'Medecins', value: medecin, color: '#198754' },
    { name: 'Autres', value: other, color: '#6c757d' },
  ];
}, [stats]);

const roleDistribution = useMemo(() => {
  const admin = stats.total_admins || 0;
  const medecin = stats.total_medecins || 0;
  const other = Math.max((stats.total_users || 0) - admin - medecin, 0);

  return [
    { label: 'Admins', value: admin, color: 'bg-warning' },
    { label: 'Medecins', value: medecin, color: 'bg-success' },
    { label: 'Autres', value: other, color: 'bg-secondary' },
  ];
}, [stats]);

return (
  <>
      

      {(section === 'dashboard' || section === 'stats') && (
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-6 col-xl-3">
            <div className="card text-bg-primary h-100">
              <div className="card-body">
                <h6 className="card-title mb-1">Total utilisateurs</h6>
                <h3 className="mb-0">{stats.total_users}</h3>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-xl-3">
            <div className="card text-bg-success h-100">
              <div className="card-body">
                <h6 className="card-title mb-1">Medecins</h6>
                <h3 className="mb-0">{stats.total_medecins}</h3>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-xl-3">
            <div className="card text-bg-warning h-100">
              <div className="card-body">
                <h6 className="card-title mb-1">Admins</h6>
                <h3 className="mb-0">{stats.total_admins}</h3>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-xl-3">
            <div className="card text-bg-info h-100">
              <div className="card-body">
                <h6 className="card-title mb-1">Actifs 30 jours</h6>
                <h3 className="mb-0">{stats.active_30_days}</h3>
              </div>
            </div>
          </div>
        </div>
      )}

      {section === 'dashboard' && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h4 mb-2">Tableau de bord Admin</h2>
            <h5 className="text-muted mb-4">Actions rapides et vue globale</h5>

            <div className="list-group mb-3">
              <Link to="/create_medecin" className="bg-primary list-group-item list-group-item-action text-white">
                Creer un medecin
              </Link>
              
            </div>

            <p className="mb-0 text-muted">
              Nouveaux utilisateurs ce mois: <strong>{stats.new_this_month || 0}</strong>
            </p>
          </div>
        </div>
      )}

      {(section === 'dashboard' || section === 'stats') && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="mb-3">Statistiques generales</h5>

            <div className="row g-4">
              <div className="col-12 col-lg-7">
                <h6 className="mb-3">Indicateurs principaux</h6>
                <div style={{ width: '100%', height: 280 }}>
                  <ResponsiveContainer>
                    <BarChart data={barChartData}>
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#0d6efd" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="col-12 col-lg-5">
                <h6 className="mb-3">Repartition des roles</h6>
                <div style={{ width: '100%', height: 280 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        label
                      >
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

            <hr className="my-4" />

            <h6 className="mb-3">Pourcentages rapides</h6>
            <div className="row g-2">
              <div className="col-12 col-md-4">
                <div className="alert alert-warning mb-0">Admins: {chartData.adminsPercent}%</div>
              </div>
              <div className="col-12 col-md-4">
                <div className="alert alert-success mb-0">Medecins: {chartData.medecinsPercent}%</div>
              </div>
              <div className="col-12 col-md-4">
                <div className="alert alert-info mb-0">Actifs 30j: {chartData.actifsPercent}%</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {section === 'users' && (
        <div className="card shadow-sm">
          <div className="card-body">
            <h2 className="h4 mb-2">Gestion utilisateurs</h2>
            <h5 className="text-muted mb-4">Liste, recherche et suivi des comptes</h5>

            <div className="list-group mb-4">
              <Link to="/create_medecin" className="bg-primary list-group-item list-group-item-action text-white">
                Creer un medecin
              </Link>

            </div>

            <DataTable columns={columns} data={users} pagination />
          </div>
        </div>
      )}
  </>
);
}