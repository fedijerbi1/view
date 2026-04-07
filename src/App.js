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
    </div>
  );
}

export default App;
