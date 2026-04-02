
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Espaceadmin () {
const token =  localStorage.getItem('token'); 
/*const userTable= axios.get({
  baseURL: 'http://localhost:5000/api/users',
  headers: {
    'Authorization': `Bearer ${token}`
  }
}); */
return (
    <div className='container mt-5'> 
     <div className='row justify-content-center'>
        <div className='col-md-8'>
             <div className='card'>
                 <div className='card-body'>
        <h1 className='mb-6'>Espace Admin</h1>
        <div className='list-group'>
            <Link to="/create-medecin" className='list-group-item list-group-item-action'>Créer un médecin</Link>
            <Link to="/create-patient" className='list-group-item list-group-item-action'>Créer un patient</Link>
            <Link to="/manage-users" className='list-group-item list-group-item-action'>Gérer les utilisateurs</Link>
        </div> 
        </div>
        </div>
        </div>
        </div>
    </div>
);




}