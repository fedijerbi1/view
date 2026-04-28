import logo from '../favicon.ico';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Swal from 'sweetalert2';

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

    // Enhanced validation
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
    if (!/^\+?[1-9]\d{1,14}$/.test(form.telephone.replace(/\\s/g, ''))) {
      Swal.fire('Erreur', 'Numéro de téléphone invalide.', 'error');
      return;
    }

    try {
      // Mock API submission (replace with real endpoint if available)
      console.log('Submitting doctor data:', form);
      // Example: await axios.post('/api/medecins', form);

      Swal.fire('Succès', 'Compte médecin créé avec succès !', 'success');
      setForm({
        cin: '',
        nom: '',
        prenom: '',
        email: '',
        dateNaissance: '',
        specialite: 'Médecine générale',
        telephone: '',
        adresseCabinet: '',
      });
    } catch (error) {
      Swal.fire('Erreur', 'Erreur lors de la création du compte.', 'error');
    }
  };

  return (
    <div>
      <header className='p-2'>
        <img src={logo} alt='logo' width='50' height='50' />
      </header>

      <div className='container mt-5'>
        <div className='row justify-content-center'>
          <div className='col-md-8'>
            <div className='card'>
              <div className='card-body'>
                <h2 className='card-title'>Créer un compte médecin</h2> 

                <form onSubmit={handleSubmit}>
                  <div className='mb-3'>
                    <label htmlFor='cin' className='form-label'>CIN</label>
                    <input 
                      type='text' 
                      id='cin' 
                      name='cin' 
                      className='form-control' 
                      value={form.cin} 
                      onChange={handleChange}
                      placeholder='12345678'
                    />
                  </div>

                  <div className='row'>
                    <div className='col-md-6 mb-3'>
                      <label htmlFor='nom' className='form-label'>Nom</label>
                      <input type='text' id='nom' name='nom' className='form-control' value={form.nom} onChange={handleChange} />
                    </div>
                    <div className='col-md-6 mb-3'>
                      <label htmlFor='prenom' className='form-label'>Prénom</label>
                      <input type='text' id='prenom' name='prenom' className='form-control' value={form.prenom} onChange={handleChange} />
                    </div>
                  </div>

                  <div className='mb-3'>
                    <label htmlFor='email' className='form-label'>Email</label>
                    <input type='email' id='email' name='email' className='form-control' value={form.email} onChange={handleChange} />
                  </div>

                  <div className='mb-3'>
                    <label htmlFor='dateNaissance' className='form-label'>Date de naissance</label>
                    <input type='date' id='dateNaissance' name='dateNaissance' className='form-control' value={form.dateNaissance} onChange={handleChange} />
                  </div>

                  <div className='mb-3'>
                    <label htmlFor='specialite' className='form-label'>Spécialité</label>
                    <select id='specialite' name='specialite' className='form-select' value={form.specialite} onChange={handleChange}>
                      {specialites.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div className='mb-3'>
                    <label htmlFor='telephone' className='form-label'>Téléphone</label>
                    <input 
                      type='tel' 
                      id='telephone' 
                      name='telephone' 
                      className='form-control' 
                      value={form.telephone} 
                      onChange={handleChange}
                      placeholder='+33612345678'
                    />
                  </div>

                  <div className='mb-3'>
                    <label htmlFor='adresseCabinet' className='form-label'>Adresse du cabinet</label>
                    <input type='text' id='adresseCabinet' name='adresseCabinet' className='form-control' value={form.adresseCabinet} onChange={handleChange} />
                  </div>

                  <button type='submit' className='btn btn-primary'>Créer le compte médecin</button>
                  <Link to='/espace-admin' className='btn btn-link ms-2'>Retour à l'accueil</Link>
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

