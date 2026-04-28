import { Nav, Button } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function SideBar({ title, items, bg = 'bg-primary' }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: 'Déconnexion',
      text: 'Êtes-vous sûr de vouloir vous déconnecter ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, déconnecter',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        navigate('/');
        Swal.fire('Déconnecté', 'Vous avez été déconnecté avec succès.', 'success');
      }
    });
  };
  return (
    <aside
      className={`${bg} text-white p-3 border-end border-secondary d-flex flex-column`}
      style={{ minHeight: '100vh', position: 'sticky', top: 0 }}
    >
      {/* En-tête */}
      <img src="/favicon.ico" alt="logo" width="40" height="40" className="mb-3" />
      <h5 className="mt-2 mb-4">{title}</h5>
      <hr className="border-light opacity-50" />

      {/* Menu items */}
      <Nav className="flex-column gap-2 flex-grow-1" style={{ overflowY: 'auto' }}>
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `nav-link rounded text-start ${
                isActive ? 'bg-light text-primary fw-semibold' : 'text-white'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </Nav>

      {/* Bouton Déconnexion (en bas) */}
      <hr className="border-light opacity-50 mt-auto mb-3" />
      <Button 
        variant="outline-light" 
        className="w-100 text-white" 
        onClick={handleLogout}
      >
        <i className="bi bi-box-arrow-left me-2"></i>
        Déconnexion
      </Button>
    </aside>
  );
}