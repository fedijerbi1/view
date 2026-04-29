import logo from '../favicon.ico'; 

import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { useEffect, useState } from 'react'; 
import Swal from 'sweetalert2';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';

const C = {
    primary: "#1E6FE3",
    surface: "#E7E5E4",
    text: "#1E2938",
    textMuted: "#64748B",
    cardShadow: "8px 8px 16px #c4c3c2, -8px -8px 16px #ffffff",
    insetShadow: "inset 4px 4px 8px #c4c3c2, inset -4px -4px 8px #ffffff",
};

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
        <div style={{minHeight: "100vh", backgroundColor: C.surface, color: C.text, fontFamily: "'Space Mono', monospace", paddingTop: "50px"}}> 
            <header className='p-2' style={{textAlign: 'center', marginBottom: "20px"}}>
                <div style={{
                    width: "80px", height: "80px", margin: "0 auto", borderRadius: "50%",
                    boxShadow: C.cardShadow, display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                    <img src={logo} alt="logo" width="40" height="40" />
                </div>
            </header>
        <div className='container mt-5'>
            <div className='row justify-content-center'>
                <div className='col-md-5'>
                    <div className='card border-0' style={{boxShadow: C.cardShadow, backgroundColor: C.surface, borderRadius: "20px", padding: "30px"}}> 
                        <div className='card-body text-center'>
                         
                <h2 className='card-title' style={{color: C.primary, fontWeight: 700}}>Se connecter</h2> 
                <p className='mb-4' style={{color: C.textMuted}}>Patient/Médecin/Admin</p> 

                    <form onSubmit={handleSubmit} style={{textAlign: "left"}}>
                        <div className='mb-4'>
                            <label htmlFor="email" className='form-label' style={{fontWeight: "bold"}}>Email</label>
                            <input type="text" id="email" name="email" className='form-control border-0' 
                                style={{backgroundColor: C.surface, boxShadow: C.insetShadow, color: C.text, padding: "12px 15px", borderRadius: "10px"}}
                                value={form.email} onChange={handleChange} />
                        </div>
                        <div className='mb-4'>
                            <label htmlFor="password" className='form-label' style={{fontWeight: "bold"}}>Mot de passe</label>
                            <input type="password" id="password" name="password" className='form-control border-0' 
                                style={{backgroundColor: C.surface, boxShadow: C.insetShadow, color: C.text, padding: "12px 15px", borderRadius: "10px"}}
                                value={form.password} onChange={handleChange} />
                </div> 
                <button type="submit" className='btn w-100 mb-3' 
                    style={{backgroundColor: C.surface, color: C.primary, boxShadow: C.cardShadow, fontWeight: "bold", padding: "12px", borderRadius: "10px", border: "none"}}
                    onMouseDown={(e)=>e.currentTarget.style.boxShadow = C.insetShadow}
                    onMouseUp={(e)=>e.currentTarget.style.boxShadow = C.cardShadow}
                    onMouseLeave={(e)=>e.currentTarget.style.boxShadow = C.cardShadow}
                >Se connecter</button> 
                
                <div className="d-flex justify-content-between mt-4">
                    <Link to="/forgot-password" style={{color: C.textMuted, fontSize: "0.9rem", textDecoration: "none"}}>Mot de passe oublié ?</Link> 
                    <Link to="/register-patient" style={{color: C.primary, fontSize: "0.9rem", textDecoration: "none", fontWeight: "bold"}}>S'inscrire</Link> 
                </div>
            </form>
        </div>
    </div>
</div>
</div>
</div>
 </div>   
    
    
    );
}