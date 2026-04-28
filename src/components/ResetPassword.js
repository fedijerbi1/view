import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const presetEmail = useMemo(() => {
        const searchParams = new URLSearchParams(location.search);
        const emailFromQuery = searchParams.get('email');
        return emailFromQuery || location.state?.email || '';
    }, [location.search, location.state]);

    const [form, setForm] = useState({
        email: presetEmail,
        code: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    function handleChange(event) {
        const { name, value } = event.target;
        setForm((prevForm) => ({ ...prevForm, [name]: value }));
    }

    function validate() {
        if (form.email.trim() === '') {
            return 'Email requis.';
        }
        if (form.code.trim() === '') {
            return 'Code requis.';
        }
        if (form.newPassword.trim() === '') {
            return 'Nouveau mot de passe requis.';
        }
        if (form.newPassword.length < 8) {
            return 'Le mot de passe doit contenir au moins 8 caracteres.';
        }
        if (form.confirmPassword.trim() === '') {
            return 'Confirmation requise.';
        }
        if (form.newPassword !== form.confirmPassword) {
            return 'Les mots de passe ne correspondent pas.';
        }
        return '';
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const errorMessage = validate();
        if (errorMessage) {
            Swal.fire('Erreur', errorMessage, 'error');
            return;
        }

        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/verify-code', {
                email: form.email,
                code: form.code,
                newPassword: form.newPassword
            });
            Swal.fire('Mot de passe modifie', 'Vous pouvez vous reconnecter.', 'success');
            navigate('/');
        } catch (error) {
            Swal.fire('Erreur', error.response?.data?.message || 'Une erreur est survenue.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-shell">
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-9">
                        <div className="card auth-card shadow-lg">
                            <div className="row g-0">
                                <div className="col-md-5 d-none d-md-flex auth-side">
                                    <div className="p-4 p-lg-5 text-white">
                                        <p className="text-uppercase auth-kicker">Verification</p>
                                        <h2 className="auth-title">Nouveau mot de passe</h2>
                                        <p className="auth-lead">
                                            Entrez le code recu et choisissez un nouveau mot de passe.
                                        </p>
                                        <div className="auth-steps">
                                            <div>Code valide pendant 15 minutes.</div>
                                            <div>Utilisez au moins 8 caracteres.</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-7">
                                    <div className="card-body p-4 p-lg-5">
                                        <h3 className="mb-3">Reinitialiser le mot de passe</h3>
                                        <p className="text-muted mb-4">
                                            Saisissez votre email, le code recu et un nouveau mot de passe.
                                        </p>
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-3">
                                                <label htmlFor="email" className="form-label">Email</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    id="email"
                                                    name="email"
                                                    placeholder="exemple@domaine.com"
                                                    value={form.email}
                                                    onChange={handleChange}
                                                    autoComplete="email"
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="code" className="form-label">Code</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="code"
                                                    name="code"
                                                    placeholder="000000"
                                                    value={form.code}
                                                    onChange={handleChange}
                                                    autoComplete="one-time-code"
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="newPassword" className="form-label">Nouveau mot de passe</label>
                                                <div className="input-group">
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        className="form-control"
                                                        id="newPassword"
                                                        name="newPassword"
                                                        placeholder="Minimum 8 caracteres"
                                                        value={form.newPassword}
                                                        onChange={handleChange}
                                                        autoComplete="new-password"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-secondary"
                                                        onClick={() => setShowPassword((prev) => !prev)}
                                                    >
                                                        {showPassword ? 'Masquer' : 'Afficher'}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="mb-4">
                                                <label htmlFor="confirmPassword" className="form-label">Confirmer</label>
                                                <div className="input-group">
                                                    <input
                                                        type={showConfirm ? 'text' : 'password'}
                                                        className="form-control"
                                                        id="confirmPassword"
                                                        name="confirmPassword"
                                                        placeholder="Repetez le mot de passe"
                                                        value={form.confirmPassword}
                                                        onChange={handleChange}
                                                        autoComplete="new-password"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-secondary"
                                                        onClick={() => setShowConfirm((prev) => !prev)}
                                                    >
                                                        {showConfirm ? 'Masquer' : 'Afficher'}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
                                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                                    {loading ? 'Validation...' : 'Confirmer'}
                                                </button>
                                                <Link to="/" className="btn btn-link p-0 text-decoration-none">
                                                    Se connecter
                                                </Link>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
