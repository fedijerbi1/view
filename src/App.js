import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import CreateMedecin from './components/create_medecin'; 
import Espaceadmin from './components/Espaceadmin';
import RegisterPatient from './components/RegisterPatient';
import ChangePassword from './components/ChangePassword';
import EspaceMedecin from './components/EspaceMedecin';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/create_medecin" element={<CreateMedecin />} /> 
          <Route path="/espace-admin" element={<Espaceadmin />} /> 
          <Route path="/register-patient" element={<RegisterPatient />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/espace-medecin" element={<EspaceMedecin />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
