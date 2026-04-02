import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import CreateMedecin from './components/create_medecin'; 
import Espaceadmin from './components/Espaceadmin';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/create_medecin" element={<CreateMedecin />} /> 
          <Route path="/espace-admin" element={<Espaceadmin />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
