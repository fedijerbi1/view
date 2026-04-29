import logo from '../favicon.ico'; 

import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { useEffect, useState } from 'react'; 
import Swal from 'sweetalert2';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import { C } from '../theme/unifiedTheme';
import './Login.css';

export default function Login() { 
    const navigate = useNavigate();

    const [form, setForm] = useState({email: '', password: ''});
    function handleChange(event) {
        const { name, value } = event.target;
        setForm(prevForm => ({ ...prevForm, [name]: value }));
    }
    const handleSubmit = (event) => {
        event.preventDefault();  
        axios.post('http://localhost:5000/api/login', form)
            .then(response => {
                console.log(response.data);
                Swal.fire('Success', 'Login successful!', 'success'); 
                localStorage.setItem('token', response.data.token);
                if (response.data.role === 'admin') {
                    navigate('/espace-admin');
                } else if (response.data.role === 'medecin') {
                    navigate('/espace-medecin');
                } else if (response.data.role === 'patient') {
                    navigate('/espacepatient');
                }
            })
            .catch(error => {
                console.error(error);
                Swal.fire('Error', error.response?.data?.message || 'An error occurred', 'error');
            });
        if ( form.email.trim() === '' || form.password.trim() === '') {
            Swal.fire('Error', 'Please fill in both email and password fields.', 'error');
            return;
        } 
        
        setForm({email: '', password: '',});
    };

    return (
        <div className="login-shell">
            <div className="login-card">
                <div className="login-card-side">
                    <h2>Bienvenue</h2>
                    <p>Connectez-vous à votre compte médical</p>
                </div>
                <div className="login-card-body">
                    <div className="login-logo">
                        <img src={logo} alt="logo" />
                    </div>
                    <h2 className="login-title">Se connecter</h2>
                    <p className="login-subtitle">Patient/Médecin/Admin</p>

                    <form onSubmit={handleSubmit}>
                        <div className="login-form-group">
                            <label htmlFor="email" className="login-label">Email</label>
                            <input 
                                type="text" 
                                id="email" 
                                name="email" 
                                className="login-input"
                                value={form.email} 
                                onChange={handleChange} 
                            />
                        </div>
                        <div className="login-form-group">
                            <label htmlFor="password" className="login-label">Mot de passe</label>
                            <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                className="login-input"
                                value={form.password} 
                                onChange={handleChange} 
                            />
                        </div>
                        <button type="submit" className="login-button">Se connecter</button>
                    </form>

                    <div className="login-actions">
                        <Link to="/forgot-password" className="login-forgot">Mot de passe oublié ?</Link>
                        <Link to="/register-patient" className="auth-link">S'inscrire</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}