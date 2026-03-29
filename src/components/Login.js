import logo from '../favicon.ico'; 

import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { useState } from 'react'; 
import Swal from 'sweetalert2';
export default function Login() { 
    
    const [form, setForm] = useState({cin: '', password: '', role: 'medecin'});
    function handleChange(event) {
        const { name, value } = event.target;
        setForm(prevForm => ({ ...prevForm, [name]: value }));
    }
    const handleSubmit = (event) => {
        event.preventDefault(); 
        if ( form.cin.trim() === '' || form.password.trim() === '') {
            Swal.fire('Error', 'Please fill in both CIN and password fields.', 'error');
            return;
        }
        setForm({cin: '', password: '',role: 'medecin'});
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
                         
                <h1 className='card-title'>Login</h1> 
                <div className="mb-3">
                                        <label className="form-label">Type d'utilisateur</label>
                                        <select 
                                        htmlFor="role" name="role" id="role"
                                            className="form-select"
                                            value={form.role}
                                            onChange={handleChange}
                                        >
                                            <option  value="medecin">Médecin</option>
                                            <option value="patient">Patient</option>
                                        </select>
                                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className='mb-3'>
                            <label htmlFor="cin" className='form-label'>CIN:</label>
                            <input type="text" id="cin" name="cin" className='form-control' value={form.cin} onChange={handleChange} />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor="password" className='form-label'>Password:</label>
                            <input type="password" id="password" name="password" className='form-control' value={form.password} onChange={handleChange} />
                </div> 
                <button type="submit" className='btn btn-primary'>Login</button> 
                <Link to="/forgot-password" className='btn btn-link'>Forgot Password?</Link> 
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