
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios'; 
import DataTable from 'react-data-table-component';
 const columns = [ 
{ name:"id" , selector: row => row.id, sortable: true },
  { name: "Nom", selector: row => row.name, sortable: true },
  { name: "Email", selector: row => row.email, sortable: true },
  
  { name: "role", selector: row => row.role, sortable: true }, 
  { name: "CIN", selector: row => row.cin, sortable: true },
  {name:"Date de creation ", selector: row => row.created_at, sortable: true },
  {name:"plan", selector: row => row.plan, sortable: true },
  { name: "Date de creation ", selector: row => row.created_at, sortable: true }
]; 


export default function Espaceadmin () {
const navigate = useNavigate();

const haundleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
};  
const [users,Setusers]= useState ([]) ; 
useEffect (()=>{
const fetchUsers = async ()=> { 
    try { 
        const token = localStorage.getItem ('token');  
const response =await axios.get ("http://localhost:5000/api/users",{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });  
        console.log (response.data) ;
        Setusers(response.data)
        Swal.fire ("success" , 'données récupérées avec succès ' ,response.data) ;


} 
catch (error) { 
Swal.fire ("error" , 'erreur se produit lors de la récupération des données ' ,error) ; 
}
}
fetchUsers() ; 
console.log (users[1]) ;

},[]);
return (
    <div className='container mt-5'>
        <div className='d-flex justify-content-end mb-3'>
            <button type='button' onClick={haundleLogout} className='btn btn-outline-primary '>Se déconnecter</button>
        </div>
        <div className='row justify-content-center'>
            <div className='col-md-8'>
                <div className='card'>
                    <div className='card-body'>
                        <h2 className='mb-6'>Espace Admin</h2>
                        <h5 className='mb-4 text-muted subtitle'>Creation Compte medecine & gestion utilisateur</h5>
                        <div className='list-group'>
                            <Link to="/create_medecin" className='list-group-item list-group-item-action'>Créer un médecin</Link>
                            
                        </div>
                        <h4>Gérer les utilisateurs </h4> 
                        <DataTable
                            columns={columns}
                            data={users}
                            pagination
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
);
}