
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios'; 
import DataTable from 'react-data-table-component';

const columns = [ 
  { name: "ID", selector: row => row.id, sortable: true, width: "60px" },
  { name: "Nom", selector: row => row.nom, sortable: true },
  { name: "Prénom", selector: row => row.prenom, sortable: true },
  { name: "Email", selector: row => row.email, sortable: true },
  { name: "Rôle", selector: row => row.role, sortable: true, width: "100px" },
  { name: "CIN", selector: row => row.cin, sortable: true },
  { name: "Date de création", selector: row => new Date(row.created_at).toLocaleDateString(), sortable: true }
]; 

export default function Espaceadmin() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }
        
        const response = await axios.get("http://localhost:5000/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        console.log('Users fetched:', response.data);
        setUsers(response.data);
        Swal.fire('Success', 'Données récupérées avec succès', 'success');
      } 
      catch (error) {
        console.error('Error fetching users:', error);
        Swal.fire('Error', 'Erreur lors de la récupération des données', 'error');
        if (error.response?.status === 401) {
          navigate('/');
        }
      }
      finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  return (
    <div className='container mt-5'>
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <h2>Espace Admin</h2>
        <button type='button' onClick={handleLogout} className='btn btn-outline-primary'>Se déconnecter</button>
      </div>

      <div className='row justify-content-center mb-4'>
        <div className='col-md-8'>
          <div className='card'>
            <div className='card-body'>
              <h5 className='mb-4 text-muted'>Création Compte médecin & gestion utilisateur</h5>
              <div className='list-group'>
                <Link to="/create_medecin" className='list-group-item list-group-item-action'>
                  <i className="bi bi-plus-circle me-2"></i>Créer un médecin
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='row'>
        <div className='col-12'>
          <div className='card'>
            <div className='card-header'>
              <h4 className='mb-0'>Gérer les utilisateurs</h4>
            </div>
            <div className='card-body'>
              {loading ? (
                <div className='text-center'>
                  <div className='spinner-border' role='status'>
                    <span className='visually-hidden'>Chargement...</span>
                  </div>
                </div>
              ) : (
                <DataTable
                  columns={columns}
                  data={users}
                  pagination
                  noDataComponent="Aucun utilisateur trouvé"
                  striped
                  responsive
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}