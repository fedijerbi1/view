import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import CreateMedecin from './components/create_medecin'; 
import Espaceadmin from './components/Espaceadmin';
import RegisterPatient from './components/RegisterPatient';
import ChangePassword from './components/ChangePassword';
import EspacePatient from './components/EspacePatient';
import EspaceMedecin from './components/EspaceMedecin';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import PortalLayout from './components/PortalLayout';
function RequireAuth() {
  const token = localStorage.getItem('token');
  return token ? <Outlet /> : <Navigate to="/" replace />;
}

function AdminLayout() {
  const menuItems = [
    { to: '/espace-admin/tableau-de-bord', label: 'Tableau de bord', icon: '📊' },
    { to: '/espace-admin/gestion-utilisateurs', label: 'Gestion utilisateurs', icon: '👥' },
    { to: '/espace-admin/statistiques-generales', label: 'Statistiques generales', icon: '📈' },
  ];

  return (
    <PortalLayout title="Espace Admin" subtitle="Pilotage et supervision" items={menuItems} accent="primary">
      <Outlet />
    </PortalLayout>
  );
}

function MedecinLayout() {
  const menuItems = [
    { to: '/espace-medecin/tableau-de-bord', label: 'Tableau de bord', icon: '🏥' },
    { to: '/espace-medecin/patients', label: 'Patients', icon: '🧑‍⚕️' },
    { to: '/espace-medecin/dossier', label: 'Dossier patient', icon: '📁' },
    { to: '/espace-medecin/prescriptions', label: 'Prescriptions', icon: '🧾' },
    { to: '/espace-medecin/communication', label: 'Communication', icon: '💬' },
    { to: '/espace-medecin/rapports', label: 'Rapports', icon: '📝' },
  ];

  return (
    <PortalLayout title="Espace Medecin" subtitle="Suivi clinique" items={menuItems} accent="info">
      <Outlet />
    </PortalLayout>
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

          <Route path="/espacepatient" element={<EspacePatient section="dashboard" />} />
          <Route path="/espacepatient/tableau-de-bord" element={<Navigate to="/espacepatient" replace />} />
          <Route path="/espacepatient/saisie-donnees" element={<Navigate to="/espacepatient/vitals" replace />} />
          <Route path="/espacepatient/objectifs" element={<Navigate to="/espacepatient/goals" replace />} />
          <Route path="/espacepatient/notifications" element={<Navigate to="/espacepatient/history" replace />} />
          <Route path="/espacepatient/vitals" element={<EspacePatient section="vitals" />} />
          <Route path="/espacepatient/biometrics" element={<EspacePatient section="biometrics" />} />
          <Route path="/espacepatient/activity" element={<EspacePatient section="activity" />} />
          <Route path="/espacepatient/nutrition" element={<EspacePatient section="nutrition" />} />
          <Route path="/espacepatient/pathology" element={<EspacePatient section="pathology" />} />
          <Route path="/espacepatient/goals" element={<EspacePatient section="goals" />} />
          <Route path="/espacepatient/history" element={<EspacePatient section="history" />} />

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
