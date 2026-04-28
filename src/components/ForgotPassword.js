
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (email.trim() === '') {
      return;
    }

    setLoading(true);
    const emailParam = encodeURIComponent(email);
    const targetUrl = `/reset-password${emailParam ? `?email=${emailParam}` : ''}`;
    axios.post('http://localhost:5000/api/forgot-password', { email })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
    window.location.assign(targetUrl);
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
                    <p className="text-uppercase auth-kicker">Securite</p>
                    <h2 className="auth-title">Mot de passe oublie</h2>
                    <p className="auth-lead">
                      Entrez votre email pour recevoir un code unique.
                    </p>
                    <div className="auth-steps">
                      <div>1. Recevoir le code</div>
                      <div>2. Creer un nouveau mot de passe</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-7">
                  <div className="card-body p-4 p-lg-5">
                    <h3 className="mb-3">Recuperation du compte</h3>
                    <p className="text-muted mb-4">
                      Indiquez votre email. Nous allons vous envoyer un code.
                    </p>
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          placeholder="exemple@domaine.com"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          autoComplete="email"
                        />
                      </div>
                      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                          {loading ? 'Envoi en cours...' : 'Envoyer le code'}
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