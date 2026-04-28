import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import CreateMedecin from './components/create_medecin'; 
import Espaceadmin from './components/Espaceadmin';
import RegisterPatient from './components/RegisterPatient';
import ChangePassword from './components/ChangePassword';
import EspacePatient from './components/EspacePatient';
import EspaceMedecin from './components/EspaceMedecin';
import SideBar from './components/SideBar';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
function RequireAuth() {
  const token = localStorage.getItem('token');
  return token ? <Outlet /> : <Navigate to="/" replace />;
}

function AdminLayout() {
  const menuItems = [
    { to: '/espace-admin/tableau-de-bord', label: 'Tableau de bord' },
    { to: '/espace-admin/gestion-utilisateurs', label: 'Gestion utilisateurs' },
    { to: '/espace-admin/statistiques-generales', label: 'Statistiques generales' },
  ];

  return (
    <div className="container-fluid p-0">
      <div className="row g-0 min-vh-100 align-items-stretch">
        <div className="col-12 col-md-3 col-lg-2 p-0">
          <SideBar title="Espace Admin" items={menuItems} bg="bg-primary" />
        </div>
        <main className="col-12 col-md-9 col-lg-10 py-4 px-3 px-md-4 min-vh-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function PatientLayout() {
  const menuItems = [
    { to: '/espacepatient/tableau-de-bord', label: 'Tableau de bord' },
    { to: '/espacepatient/saisie-donnees', label: 'Saisie des données' },
    { to: '/espacepatient/objectifs', label: 'Objectifs' },
    { to: '/espacepatient/notifications', label: 'Notifications' },
  ];

  return (
    <div className="container-fluid p-0">
      <div className="row g-0 min-vh-100 align-items-stretch">
        <div className="col-12 col-md-3 col-lg-2 p-0">
          <SideBar title="Espace Patient" items={menuItems} bg="bg-success" />
        </div>
        <main className="col-12 col-md-9 col-lg-10 py-4 px-3 px-md-4 min-vh-100 bg-light">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function MedecinLayout() {
  const menuItems = [
    { to: '/espace-medecin/tableau-de-bord', label: 'Tableau de bord' },
    { to: '/espace-medecin/patients', label: 'Patients' },
    { to: '/espace-medecin/dossier', label: 'Dossier patient' },
    { to: '/espace-medecin/prescriptions', label: 'Prescriptions' },
    { to: '/espace-medecin/communication', label: 'Communication' },
    { to: '/espace-medecin/rapports', label: 'Rapports' },
  ];

  return (
    <div className="container-fluid p-0">
      <div className="row g-0 min-vh-100 align-items-stretch">
        <div className="col-12 col-md-3 col-lg-2 p-0">
          <SideBar title="Espace Médecin" items={menuItems} bg="bg-info" />
        </div>
        <main className="col-12 col-md-9 col-lg-10 py-4 px-3 px-md-4 min-vh-100 bg-light">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register-patient" element={<RegisterPatient />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />


        <Route element={<RequireAuth />}>
          <Route path="/espace-admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="tableau-de-bord" replace />} />
            <Route path="tableau-de-bord" element={<Espaceadmin section="dashboard" />} />
            <Route path="gestion-utilisateurs" element={<Espaceadmin section="users" />} />
            <Route path="statistiques-generales" element={<Espaceadmin section="stats" />} />
          </Route>

          <Route path="/espacepatient" element={<PatientLayout />}>
            <Route index element={<Navigate to="tableau-de-bord" replace />} />
            <Route path="tableau-de-bord" element={<EspacePatient section="dashboard" />} />
            <Route path="saisie-donnees" element={<EspacePatient section="saisie" />} />
            <Route path="objectifs" element={<EspacePatient section="objectifs" />} />
            <Route path="notifications" element={<EspacePatient section="notifications" />} />
          </Route>

          <Route path="/espace-medecin" element={<MedecinLayout />}>
            <Route index element={<Navigate to="tableau-de-bord" replace />} />
            <Route path="tableau-de-bord" element={<EspaceMedecin section="dashboard" />} />
            <Route path="patients" element={<EspaceMedecin section="patients" />} />
            <Route path="dossier" element={<EspaceMedecin section="dossier" />} />
            <Route path="prescriptions" element={<EspaceMedecin section="prescriptions" />} />
            <Route path="communication" element={<EspaceMedecin section="communication" />} />
            <Route path="rapports" element={<EspaceMedecin section="rapports" />} />
          </Route>

          <Route path="/create_medecin" element={<CreateMedecin />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
