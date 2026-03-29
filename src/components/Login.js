import logo from '../favicon.ico'; 

import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
export default function Login() {
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
                    <form>
                        <div className='mb-3'>
                            <label htmlFor="username" className='form-label'>CIN:</label>
                    <input type="text" id="username" name="username" className='form-control' />
                </div> 
                <div className='mb-3'> 
                    <label htmlFor="password" className='form-label'>Password:</label>
                    <input type="password" id="password" name="password" className='form-control' />
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