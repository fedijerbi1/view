
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const C = {
  primary: "#1E6FE3",
  surface: "#E7E5E4",
  text: "#1E2938",
  textMuted: "#64748B",
  cardShadow: "8px 8px 16px #c4c3c2, -8px -8px 16px #ffffff",
  insetShadow: "inset 4px 4px 8px #c4c3c2, inset -4px -4px 8px #ffffff",
};

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
    <div style={{minHeight: "100vh", backgroundColor: C.surface, color: C.text, fontFamily: "'Space Mono', monospace", paddingTop: "50px", paddingBottom: "50px", display: "flex", alignItems: "center"}}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-9">
            <div className="card border-0" style={{backgroundColor: C.surface, boxShadow: C.cardShadow, borderRadius: "20px", overflow: "hidden"}}>
              <div className="row g-0">
                <div className="col-md-5 d-none d-md-flex" style={{backgroundColor: C.surface, borderRight: `1px solid ${C.cardShadow.split(',')[1]}`}}>
                  <div className="p-4 p-lg-5" style={{boxShadow: C.insetShadow, height: "100%", width: "100%", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                    <p className="text-uppercase" style={{color: C.primary, fontWeight: "bold"}}>Securite</p>
                    <h2 style={{color: C.text, fontWeight: 700}}>Mot de passe oublie</h2>
                    <p style={{color: C.textMuted}}>
                      Entrez votre email pour recevoir un code unique.
                    </p>
                    <div style={{marginTop: "30px", color: C.textMuted, fontSize: "0.9rem"}}>
                      <div style={{marginBottom: "10px"}}>1. Recevoir le code</div>
                      <div>2. Creer un nouveau mot de passe</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-7">
                  <div className="card-body p-4 p-lg-5">
                    <h3 className="mb-3" style={{color: C.primary, fontWeight: 700}}>Recuperation du compte</h3>
                    <p className="mb-4" style={{color: C.textMuted}}>
                      Indiquez votre email. Nous allons vous envoyer un code.
                    </p>
                    <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <label htmlFor="email" className="form-label" style={{fontWeight: "bold"}}>Email</label>
                        <input
                          type="email"
                          className="form-control border-0"
                          id="email"
                          placeholder="exemple@domaine.com"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          autoComplete="email"
                          style={{backgroundColor: C.surface, boxShadow: C.insetShadow, color: C.text, padding: "12px 15px", borderRadius: "10px"}}
                        />
                      </div>
                      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <button type="submit" className="btn" disabled={loading}
                          style={{backgroundColor: C.surface, color: C.primary, boxShadow: C.cardShadow, fontWeight: "bold", padding: "12px 20px", borderRadius: "10px", border: "none"}}
                          onMouseDown={(e)=>e.currentTarget.style.boxShadow = C.insetShadow}
                          onMouseUp={(e)=>e.currentTarget.style.boxShadow = C.cardShadow}
                          onMouseLeave={(e)=>e.currentTarget.style.boxShadow = C.cardShadow}
                        >
                          {loading ? 'Envoi en cours...' : 'Envoyer le code'}
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