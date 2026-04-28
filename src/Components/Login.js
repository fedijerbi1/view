import logo from '../favicon.ico'; 
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react'; 
import Swal from 'sweetalert2';
import axios from 'axios'; 

export default function Login() { 
    const navigate = useNavigate();

    const [form, setForm] = useState({email: '', password: '', role: 'medecin'});
    function handleChange(event) {
        const { name, value } = event.target;
        setForm(prevForm => ({ ...prevForm, [name]: value }));
    }
    const handleSubmit = (event) => {
        event.preventDefault();  
        
        // Validate FIRST before making API call
        const email = form.email.trim();
        const password = form.password.trim();
        
        if (!email || !password) {
            Swal.fire('Error', 'Please fill in both email and password fields.', 'error');
            return;
        }
        
        if (!email.includes('@') || !email.includes('.')) {
            Swal.fire('Error', 'Please enter a valid email address.', 'error');
            return;
        }
        
        axios.post('http://localhost:5000/api/login', { email, password, role: form.role })
            .then(response => {
                console.log(response.data);
                Swal.fire('Success', 'Login successful!', 'success'); 
                localStorage.setItem('token', response.data.token);
                setForm({email: '', password: '', role: 'medecin'});
                
                if (response.data.role === 'admin') {
                    navigate('/espace-admin');
                } else if (response.data.role === 'medecin') {
                    navigate('/espacemedecin');
                } else if (response.data.role === 'patient') {
                    navigate('/patient_space');
                }
            })
            .catch(error => {
                console.error(error);
                Swal.fire('Error', error.response?.data?.message || 'An error occurred', 'error');
            });
    };

    return (
        <div> 
            <header className=' p-2'>
                <img src={logo} alt="logo" width="50" height="50" />
            </header>
        <div className='container mt-5 '>
            <div className='row justify-content-center'>
                <div className='col-md-6'>
                    <div className='card'> 
                        <div className='card-body'>
                         
                <h1 className='card-title'>Se connecter</h1> 
                <h4 className='card-subtitle mb-4 text-muted'>Patient/Médecin</h4> 

                    <form onSubmit={handleSubmit}>
                        <div className='mb-3'>
                            <label htmlFor="email" className='form-label'>email:</label>
                            <input type="text" id="email" name="email" className='form-control' value={form.email} onChange={handleChange} />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor="password" className='form-label'>Mot de passe:</label>
                            <input type="password" id="password" name="password" className='form-control' value={form.password} onChange={handleChange} />
                </div> 
                <button type="submit" className='btn btn-primary'>Se connecter
</button> 
                <Link to="/forgot-password" className='btn btn-link'>Mot de passe oublié ?</Link> 
                <Link to="/register" className='btn btn-link'>Register</Link> 
            </form>
        </div>
    </div>
</div>
</div>
</div>
 </div>   
    
    
    );
}