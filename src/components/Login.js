import logo from '../favicon.ico'; 

import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { useState } from 'react'; 
import Swal from 'sweetalert2';
export default function Login() { 
    
    const [form, setForm] = useState({cin: '', password: ''});
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
        setForm({cin: '', password: ''});
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
                        
                <h1>Login</h1>
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