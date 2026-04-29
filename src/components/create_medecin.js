import logo from '../favicon.ico';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
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

const specialites = [
  'Médecine générale',
  'Cardiologie',
  'Dermatologie',
  'Gynécologie',
  'Neurologie',
  'Ophtalmologie',
  'Orthopédie',
  'Pédiatrie',
  'Psychiatrie',
  'Radiologie',
  'Rhumatologie',
  'Urologie',
];

function CreateMedecin() {
  const Navigate = useNavigate(); 
  const [form, setForm] = useState({
    cin: '',
    nom: '',
    prenom: '',
    email: '',
    dateNaissance: '',
    specialite: 'Médecine générale',
    telephone: '',
    adresseCabinet: '',
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setForm(prevForm => ({ ...prevForm, [name]: value }));
  }

  

  const handleSubmit = async (event) => {
  event.preventDefault();

  // validations
  if (!form.cin.trim() || !/^\d{8,}$/.test(form.cin)) {
    Swal.fire('Erreur', 'CIN invalide (8 chiffres ou plus).', 'error');
    return;
  }

  if (!form.nom.trim() || !form.prenom.trim() || !form.email.trim() || !form.dateNaissance) {
    Swal.fire('Erreur', 'Veuillez remplir tous les champs requis.', 'error');
    return;
  }

  if (!form.email.includes('@') || !form.email.includes('.')) {
    Swal.fire('Erreur', 'Adresse email invalide.', 'error');
    return;
  }

  try {
    console.log("📤 ENVOI...");

    const response = await axios.post(
      'http://localhost:5000/api/create-medecin', 
      {
        nom: form.nom,
        prenom: form.prenom,
        email: form.email,
        specialite: form.specialite,
        telephone: form.telephone,
        cabinet: form.adresseCabinet
      }
    );

    console.log("✅ RESPONSE:", response.data);

    Swal.fire('Succès', response.data.message, 'success');
    if (response.data.status === 201) {
      Navigate('/espace-admin');
    }

    setForm({
      
      nom: '',
      prenom: '',
      email: '',
      dateNaissance: '',
      specialite: 'Médecine générale',
      telephone: '',
      adresseCabinet: '',
    });

  } catch (error) {
    console.error("❌ ERROR:", error);

    Swal.fire(
      'Erreur',
      error.response?.data?.message || 'Erreur serveur',
      'error'
    );
  }
};





  return (
    <div style={{minHeight: "100vh", backgroundColor: C.surface, color: C.text, fontFamily: "'Space Mono', monospace", paddingTop: "30px", paddingBottom: "50px"}}>
      <header className='p-2' style={{textAlign: "center", marginBottom: "20px"}}>
        <div style={{
            width: "80px", height: "80px", margin: "0 auto", borderRadius: "50%",
            boxShadow: C.cardShadow, display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <img src={logo} alt='logo' width='40' height='40' />
        </div>
      </header>

      <div className='container mt-3'>
        <div className='row justify-content-center'>
          <div className='col-md-8'>
            <div className='card border-0' style={{backgroundColor: C.surface, boxShadow: C.cardShadow, borderRadius: "20px", padding: "30px"}}>
              <div className='card-body'>
                <div className="text-center mb-4">
                  <h2 className='card-title' style={{color: C.primary, fontWeight: 700}}>Créer un compte médecin</h2> 
                </div>

                <form onSubmit={handleSubmit}>
                  

                  <div className='row'>
                    <div className='col-md-6 mb-4'>
                      <label htmlFor='nom' className='form-label' style={{fontWeight: "bold"}}>Nom</label>
                      <input type='text' id='nom' name='nom' className='form-control border-0' value={form.nom} onChange={handleChange} style={{backgroundColor: C.surface, boxShadow: C.insetShadow, color: C.text, padding: "12px", borderRadius: "10px"}} />
                    </div>
                    <div className='col-md-6 mb-4'>
                      <label htmlFor='prenom' className='form-label' style={{fontWeight: "bold"}}>Prénom</label>
                      <input type='text' id='prenom' name='prenom' className='form-control border-0' value={form.prenom} onChange={handleChange} style={{backgroundColor: C.surface, boxShadow: C.insetShadow, color: C.text, padding: "12px", borderRadius: "10px"}} />
                    </div>
                  </div>

                  <div className='mb-4'>
                    <label htmlFor='email' className='form-label' style={{fontWeight: "bold"}}>Email</label>
                    <input type='email' id='email' name='email' className='form-control border-0' value={form.email} onChange={handleChange} style={{backgroundColor: C.surface, boxShadow: C.insetShadow, color: C.text, padding: "12px", borderRadius: "10px"}} />
                  </div>

                  <div className='mb-4'>
                    <label htmlFor='dateNaissance' className='form-label' style={{fontWeight: "bold"}}>Date de naissance</label>
                    <input type='date' id='dateNaissance' name='dateNaissance' className='form-control border-0' value={form.dateNaissance} onChange={handleChange} style={{backgroundColor: C.surface, boxShadow: C.insetShadow, color: C.text, padding: "12px", borderRadius: "10px"}} />
                  </div>

                  <div className='mb-4'>
                    <label htmlFor='specialite' className='form-label' style={{fontWeight: "bold"}}>Spécialité</label>
                    <select id='specialite' name='specialite' className='form-select border-0' value={form.specialite} onChange={handleChange} style={{backgroundColor: C.surface, boxShadow: C.insetShadow, color: C.text, padding: "12px", borderRadius: "10px"}}>
                      {specialites.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div className='mb-4'>
                    <label htmlFor='telephone' className='form-label' style={{fontWeight: "bold"}}>Téléphone</label>
                    <input 
                      type='tel' 
                      id='telephone' 
                      name='telephone' 
                      className='form-control border-0' 
                      value={form.telephone} 
                      onChange={handleChange}
                      placeholder='+21612345678'
                      style={{backgroundColor: C.surface, boxShadow: C.insetShadow, color: C.text, padding: "12px", borderRadius: "10px"}}
                    />
                  </div>

                  <div className='mb-4'>
                    <label htmlFor='adresseCabinet' className='form-label' style={{fontWeight: "bold"}}>Adresse du cabinet</label>
                    <input type='text' id='adresseCabinet' name='adresseCabinet' className='form-control border-0' value={form.adresseCabinet} onChange={handleChange} style={{backgroundColor: C.surface, boxShadow: C.insetShadow, color: C.text, padding: "12px", borderRadius: "10px"}} />
                  </div>

                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mt-4">
                    <button type='submit' className='btn'
                      style={{backgroundColor: C.surface, color: C.primary, boxShadow: C.cardShadow, fontWeight: "bold", padding: "12px 20px", borderRadius: "10px", border: "none"}}
                      onMouseDown={(e)=>e.currentTarget.style.boxShadow = C.insetShadow}
                      onMouseUp={(e)=>e.currentTarget.style.boxShadow = C.cardShadow}
                      onMouseLeave={(e)=>e.currentTarget.style.boxShadow = C.cardShadow}
                    >Créer le compte</button>
                    <Link to='/espace-admin' style={{color: C.textMuted, fontWeight: "bold", textDecoration: "none"}}>
                      Retour à l'accueil
                    </Link>
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

export default CreateMedecin;