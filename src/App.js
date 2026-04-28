import { Routes, Route } from 'react-router-dom';
import './App.css';

import Login from './components/Login';
import CreateMedecin from './components/create_medecin'; 
import Espaceadmin from './components/Espaceadmin';
import RegisterPatient from './components/RegisterPatient';
import PatientSpace from './components/PatientSpace';

function App() {
  return (
    <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/create_medecin" element={<CreateMedecin />} /> 
          <Route path="/espace-admin" element={<Espaceadmin />} /> 
          <Route path="/register" element={<RegisterPatient />} />
          <Route path="/patient_space" element={<PatientSpace />} />
        </Routes>
    </div>
  );
}

export default App;