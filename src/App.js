<<<<<<< HEAD
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import CreateMedecin from './components/create_medecin';
=======
import RegisterPatient from './Components/RegisterPatient';
>>>>>>> parent of bedbd7e (Merge aymen into main)

function App() {
  return (
    <div className="App">
<<<<<<< HEAD
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/create_medecin" element={<CreateMedecin />} />
        </Routes>
      </BrowserRouter>
=======
      <RegisterPatient />
>>>>>>> parent of bedbd7e (Merge aymen into main)
    </div>
  );
}
export default App;
