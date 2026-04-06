import logo from '../favicon.ico';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (email.trim() === '') {
            Swal.fire('Erreur', 'Veuillez saisir votre adresse email.', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Swal.fire('Erreur', 'Veuillez saisir une adresse email valide.', 'error');
            return;
        }

        setLoading(true);

        axios.post('http://localhost:5000/api/forgot-password', { email })
            .then(response => {
                setLoading(false);
                setSubmitted(true);
                Swal.fire({
                    title: 'Email envoyé !',
                    text: 'Un lien de réinitialisation a été envoyé à votre adresse email.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            })
            .catch(error => {
                setLoading(false);
                Swal.fire('Erreur', error.response?.data?.message || 'Une erreur est survenue.', 'error');
            });
    };

    return (
        <div>
            <header className='p-2'>
                <img src={logo} alt="logo" width="50" height="50" />
            </header>

            <div className='container mt-5'>
                <div className='row justify-content-center'>
                    <div className='col-md-6'>
                        <div className='card'>
                            <div className='card-body'>

                                <h1 className='card-title'>Mot de passe oublié</h1>
                                <h4 className='card-subtitle mb-4 text-muted'>
                                    Saisissez votre email pour recevoir un lien de réinitialisation
                                </h4>

                                {submitted ? (
                                    <div className='alert alert-success' role='alert'>
                                        <h5 className='alert-heading'>Email envoyé !</h5>
                                        <p>
                                            Un lien de réinitialisation a été envoyé à <strong>{email}</strong>.
                                            Vérifiez votre boîte de réception.
                                        </p>
                                        <hr />
                                        <p className='mb-0'>
                                            Vous n'avez pas reçu l'email ?{' '}
                                            <button
                                                className='btn btn-link p-0'
                                                onClick={() => setSubmitted(false)}
                                            >
                                                Renvoyer
                                            </button>
                                        </p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit}>
                                        <div className='mb-3'>
                                            <label htmlFor='email' className='form-label'>
                                                Adresse email :
                                            </label>
                                            <input
                                                type='email'
                                                id='email'
                                                name='email'
                                                className='form-control'
                                                placeholder='exemple@email.com'
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                            <div className='form-text text-muted'>
                                                Nous enverrons un lien de réinitialisation à cette adresse.
                                            </div>
                                        </div>

                                        <button
                                            type='submit'
                                            className='btn btn-primary w-100 mb-3'
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className='spinner-border spinner-border-sm me-2' role='status' aria-hidden='true'></span>
                                                    Envoi en cours...
                                                </>
                                            ) : (
                                                'Envoyer le lien de réinitialisation'
                                            )}
                                        </button>

                                        <div className='text-center'>
                                            <Link to='/' className='btn btn-link'>
                                                ← Retour à la connexion
                                            </Link>
                                        </div>
                                    </form>
                                )}

                            </div>
                        </div>

                        {/* Informations supplémentaires */}
                        <div className='card mt-3'>
                            <div className='card-body'>
                                <h6 className='card-title text-muted'>Comment ça fonctionne ?</h6>
                                <ol className='text-muted' style={{ fontSize: '0.9rem' }}>
                                    <li>Saisissez votre adresse email enregistrée</li>
                                    <li>Vérifiez votre boîte de réception</li>
                                    <li>Cliquez sur le lien reçu par email</li>
                                    <li>Créez un nouveau mot de passe sécurisé</li>
                                </ol>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
