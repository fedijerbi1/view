import logo from '../favicon.ico';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function ChangePassword() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [form, setForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});

    function handleChange(event) {
        const { name, value } = event.target;
        setForm(prevForm => ({ ...prevForm, [name]: value }));
        setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    }

    function getPasswordStrength(password) {
        if (password.length === 0) return { level: 0, label: '', color: '' };
        if (password.length < 6) return { level: 1, label: 'Très faible', color: 'danger' };
        if (password.length < 8) return { level: 2, label: 'Faible', color: 'warning' };
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[^A-Za-z0-9]/.test(password);
        const score = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
        if (score <= 2) return { level: 3, label: 'Moyen', color: 'info' };
        if (score === 3) return { level: 4, label: 'Fort', color: 'primary' };
        return { level: 5, label: 'Très fort', color: 'success' };
    }

    function validate() {
        const newErrors = {};
        if (form.currentPassword.trim() === '') {
            newErrors.currentPassword = 'Le mot de passe actuel est requis.';
        }
        if (form.newPassword.trim() === '') {
            newErrors.newPassword = 'Le nouveau mot de passe est requis.';
        } else if (form.newPassword.length < 8) {
            newErrors.newPassword = 'Le mot de passe doit contenir au moins 8 caractères.';
        }
        if (form.confirmPassword.trim() === '') {
            newErrors.confirmPassword = 'La confirmation est requise.';
        } else if (form.newPassword !== form.confirmPassword) {
            newErrors.confirmPassword = 'Les mots de passe ne correspondent pas.';
        }
        if (form.newPassword === form.currentPassword && form.newPassword !== '') {
            newErrors.newPassword = 'Le nouveau mot de passe doit être différent de l\'ancien.';
        }
        return newErrors;
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        const token = localStorage.getItem('token');

        axios.post('http://localhost:5000/api/change-password', {
            currentPassword: form.currentPassword,
            newPassword: form.newPassword
        }, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                setLoading(false);
                Swal.fire({
                    title: 'Mot de passe modifié !',
                    text: 'Votre mot de passe a été mis à jour avec succès. Veuillez vous reconnecter.',
                    icon: 'success',
                    confirmButtonText: 'Se connecter'
                }).then(() => {
                    localStorage.removeItem('token');
                    navigate('/');
                });
            })
            .catch(error => {
                setLoading(false);
                Swal.fire('Erreur', error.response?.data?.message || 'Une erreur est survenue.', 'error');
            });
    };

    const strength = getPasswordStrength(form.newPassword);

    return (
        <div>
            <header className='p-2'>
                <img src={logo} alt="logo" width="50" height="50" />
            </header>

            <div className='container mt-5'>
                <div className='row justify-content-center'>
                    <div className='col-md-6'>

                        {/* Alerte première connexion */}
                        <div className='alert alert-warning d-flex align-items-center mb-4' role='alert'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-exclamation-triangle-fill me-2 flex-shrink-0" viewBox="0 0 16 16">
                                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                            </svg>
                            <div>
                                <strong>Première connexion détectée.</strong> Pour des raisons de sécurité, vous devez modifier votre mot de passe temporaire avant de continuer.
                            </div>
                        </div>

                        <div className='card'>
                            <div className='card-body'>

                                <h1 className='card-title'>Changer le mot de passe</h1>
                                <h4 className='card-subtitle mb-4 text-muted'>
                                    Créez un nouveau mot de passe sécurisé
                                </h4>

                                <form onSubmit={handleSubmit}>

                                    {/* Mot de passe actuel (temporaire) */}
                                    <div className='mb-3'>
                                        <label htmlFor='currentPassword' className='form-label'>
                                            Mot de passe temporaire :
                                        </label>
                                        <div className='input-group'>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                id='currentPassword'
                                                name='currentPassword'
                                                className={`form-control ${errors.currentPassword ? 'is-invalid' : ''}`}
                                                placeholder='Mot de passe reçu par email'
                                                value={form.currentPassword}
                                                onChange={handleChange}
                                            />
                                            <button
                                                type='button'
                                                className='btn btn-outline-secondary'
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? 'Masquer' : 'Afficher'}
                                            </button>
                                            {errors.currentPassword && (
                                                <div className='invalid-feedback'>{errors.currentPassword}</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Nouveau mot de passe */}
                                    <div className='mb-1'>
                                        <label htmlFor='newPassword' className='form-label'>
                                            Nouveau mot de passe :
                                        </label>
                                        <div className='input-group'>
                                            <input
                                                type={showConfirm ? 'text' : 'password'}
                                                id='newPassword'
                                                name='newPassword'
                                                className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
                                                placeholder='Minimum 8 caractères'
                                                value={form.newPassword}
                                                onChange={handleChange}
                                            />
                                            <button
                                                type='button'
                                                className='btn btn-outline-secondary'
                                                onClick={() => setShowConfirm(!showConfirm)}
                                            >
                                                {showConfirm ? 'Masquer' : 'Afficher'}
                                            </button>
                                            {errors.newPassword && (
                                                <div className='invalid-feedback'>{errors.newPassword}</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Barre de force du mot de passe */}
                                    {form.newPassword.length > 0 && (
                                        <div className='mb-3'>
                                            <div className='progress' style={{ height: '6px' }}>
                                                <div
                                                    className={`progress-bar bg-${strength.color}`}
                                                    style={{ width: `${(strength.level / 5) * 100}%`, transition: 'width 0.3s' }}
                                                ></div>
                                            </div>
                                            <small className={`text-${strength.color}`}>
                                                Force : {strength.label}
                                            </small>
                                        </div>
                                    )}

                                    {/* Confirmation mot de passe */}
                                    <div className='mb-3'>
                                        <label htmlFor='confirmPassword' className='form-label'>
                                            Confirmer le nouveau mot de passe :
                                        </label>
                                        <input
                                            type='password'
                                            id='confirmPassword'
                                            name='confirmPassword'
                                            className={`form-control ${errors.confirmPassword ? 'is-invalid' : form.confirmPassword && form.newPassword === form.confirmPassword ? 'is-valid' : ''}`}
                                            placeholder='Répétez le nouveau mot de passe'
                                            value={form.confirmPassword}
                                            onChange={handleChange}
                                        />
                                        {errors.confirmPassword && (
                                            <div className='invalid-feedback'>{errors.confirmPassword}</div>
                                        )}
                                        {form.confirmPassword && form.newPassword === form.confirmPassword && (
                                            <div className='valid-feedback'>Les mots de passe correspondent ✓</div>
                                        )}
                                    </div>

                                    {/* Règles du mot de passe */}
                                    <div className='mb-3 p-3 bg-light rounded'>
                                        <small className='text-muted'>
                                            <strong>Le mot de passe doit contenir :</strong>
                                            <ul className='mb-0 mt-1'>
                                                <li className={form.newPassword.length >= 8 ? 'text-success' : ''}>
                                                    Au moins 8 caractères {form.newPassword.length >= 8 ? '✓' : ''}
                                                </li>
                                                <li className={/[A-Z]/.test(form.newPassword) ? 'text-success' : ''}>
                                                    Une lettre majuscule {/[A-Z]/.test(form.newPassword) ? '✓' : ''}
                                                </li>
                                                <li className={/[0-9]/.test(form.newPassword) ? 'text-success' : ''}>
                                                    Un chiffre {/[0-9]/.test(form.newPassword) ? '✓' : ''}
                                                </li>
                                                <li className={/[^A-Za-z0-9]/.test(form.newPassword) ? 'text-success' : ''}>
                                                    Un caractère spécial (!@#$...) {/[^A-Za-z0-9]/.test(form.newPassword) ? '✓' : ''}
                                                </li>
                                            </ul>
                                        </small>
                                    </div>

                                    <button
                                        type='submit'
                                        className='btn btn-primary w-100'
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className='spinner-border spinner-border-sm me-2' role='status' aria-hidden='true'></span>
                                                Modification en cours...
                                            </>
                                        ) : (
                                            'Confirmer le nouveau mot de passe'
                                        )}
                                    </button>

                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}