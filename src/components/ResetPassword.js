import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { C } from '../theme/unifiedTheme';
import './ResetPassword.css';

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
        <div style={{minHeight: "100vh", backgroundColor: C.surface, color: C.text, fontFamily: "'Space Mono', monospace", paddingTop: "50px", paddingBottom: "50px", display: "flex", alignItems: "center"}}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-9">
                        <div className="card border-0" style={{backgroundColor: C.surface, boxShadow: C.cardShadow, borderRadius: "20px", overflow: "hidden"}}>
                            <div className="row g-0">
                                <div className="col-md-5 d-none d-md-flex" style={{backgroundColor: C.surface, borderRight: `1px solid ${C.cardShadow.split(',')[1]}`}}>
                                    <div className="p-4 p-lg-5" style={{boxShadow: C.insetShadow, height: "100%", width: "100%", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                        <p className="text-uppercase" style={{color: C.primary, fontWeight: "bold"}}>Verification</p>
                                        <h2 style={{color: C.text, fontWeight: 700}}>Nouveau mot de passe</h2>
                                        <p style={{color: C.textMuted}}>
                                            Entrez le code recu et choisissez un nouveau mot de passe.
                                        </p>
                                        <div style={{marginTop: "30px", color: C.textMuted, fontSize: "0.9rem"}}>
                                            <div style={{marginBottom: "10px"}}>Code valide pendant 15 minutes.</div>
                                            <div>Utilisez au moins 8 caracteres.</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-7">
                                    <div className="card-body p-4 p-lg-5">
                                        <h3 className="mb-3" style={{color: C.primary, fontWeight: 700}}>Reinitialiser le mot de passe</h3>
                                        <p className="mb-4" style={{color: C.textMuted}}>
                                            Saisissez votre email, le code recu et un nouveau mot de passe.
                                        </p>
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-3">
                                                <label htmlFor="email" className="form-label" style={{fontWeight: "bold"}}>Email</label>
                                                <input
                                                    type="email"
                                                    className="form-control border-0"
                                                    id="email"
                                                    name="email"
                                                    placeholder="exemple@domaine.com"
                                                    value={form.email}
                                                    onChange={handleChange}
                                                    autoComplete="email"
                                                    style={{backgroundColor: C.surface, boxShadow: C.insetShadow, color: C.text, padding: "12px", borderRadius: "10px"}}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="code" className="form-label" style={{fontWeight: "bold"}}>Code</label>
                                                <input
                                                    type="text"
                                                    className="form-control border-0"
                                                    id="code"
                                                    name="code"
                                                    placeholder="000000"
                                                    value={form.code}
                                                    onChange={handleChange}
                                                    autoComplete="one-time-code"
                                                    style={{backgroundColor: C.surface, boxShadow: C.insetShadow, color: C.text, padding: "12px", borderRadius: "10px"}}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="newPassword" className="form-label" style={{fontWeight: "bold"}}>Nouveau mot de passe</label>
                                                <div className="input-group">
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        className="form-control border-0"
                                                        id="newPassword"
                                                        name="newPassword"
                                                        placeholder="Minimum 8 caracteres"
                                                        value={form.newPassword}
                                                        onChange={handleChange}
                                                        autoComplete="new-password"
                                                        style={{backgroundColor: C.surface, boxShadow: C.insetShadow, color: C.text, padding: "12px", borderRadius: "10px 0 0 10px"}}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn border-0"
                                                        onClick={() => setShowPassword((prev) => !prev)}
                                                        style={{backgroundColor: C.surface, boxShadow: C.cardShadow, color: C.textMuted, fontWeight: "bold", borderRadius: "0 10px 10px 0"}}
                                                        onMouseDown={(e)=>e.currentTarget.style.boxShadow = C.insetShadow}
                                                        onMouseUp={(e)=>e.currentTarget.style.boxShadow = C.cardShadow}
                                                        onMouseLeave={(e)=>e.currentTarget.style.boxShadow = C.cardShadow}
                                                    >
                                                        {showPassword ? 'Masquer' : 'Afficher'}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="mb-4">
                                                <label htmlFor="confirmPassword" className="form-label" style={{fontWeight: "bold"}}>Confirmer</label>
                                                <div className="input-group">
                                                    <input
                                                        type={showConfirm ? 'text' : 'password'}
                                                        className="form-control border-0"
                                                        id="confirmPassword"
                                                        name="confirmPassword"
                                                        placeholder="Repetez le mot de passe"
                                                        value={form.confirmPassword}
                                                        onChange={handleChange}
                                                        autoComplete="new-password"
                                                        style={{backgroundColor: C.surface, boxShadow: C.insetShadow, color: C.text, padding: "12px", borderRadius: "10px 0 0 10px"}}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn border-0"
                                                        onClick={() => setShowConfirm((prev) => !prev)}
                                                        style={{backgroundColor: C.surface, boxShadow: C.cardShadow, color: C.textMuted, fontWeight: "bold", borderRadius: "0 10px 10px 0"}}
                                                        onMouseDown={(e)=>e.currentTarget.style.boxShadow = C.insetShadow}
                                                        onMouseUp={(e)=>e.currentTarget.style.boxShadow = C.cardShadow}
                                                        onMouseLeave={(e)=>e.currentTarget.style.boxShadow = C.cardShadow}
                                                    >
                                                        {showConfirm ? 'Masquer' : 'Afficher'}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                                                <button type="submit" className="btn" disabled={loading}
                                                    style={{backgroundColor: C.surface, color: C.primary, boxShadow: C.cardShadow, fontWeight: "bold", padding: "12px 20px", borderRadius: "10px", border: "none"}}
                                                    onMouseDown={(e)=>e.currentTarget.style.boxShadow = C.insetShadow}
                                                    onMouseUp={(e)=>e.currentTarget.style.boxShadow = C.cardShadow}
                                                    onMouseLeave={(e)=>e.currentTarget.style.boxShadow = C.cardShadow}
                                                >
                                                    {loading ? 'Validation...' : 'Confirmer'}
                                                </button>
                                                <Link to="/" style={{color: C.textMuted, fontWeight: "bold", textDecoration: "none"}}>
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
