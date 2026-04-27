<<<<<<< HEAD
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import RegisterPatient from './components/RegisterPatient';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} /><Route path="/register" element={<RegisterPatient />} />
      </Routes>
=======
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import CreateMedecin from './components/create_medecin'; 
import Espaceadmin from './components/Espaceadmin';
import RegisterPatient from './components/RegisterPatient';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/create_medecin" element={<CreateMedecin />} /> 
          <Route path="/espace-admin" element={<Espaceadmin />} /> 
          <Route path="/register-patient" element={<RegisterPatient />} />
        </Routes>
      </BrowserRouter>
>>>>>>> 7dcfe66fbc7564d5b7ad4e493e20772900f3e0cf
    </div>
  );
}
export default App;
