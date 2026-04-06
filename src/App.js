import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import RegisterPatient from './components/RegisterPatient';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<RegisterPatient />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
