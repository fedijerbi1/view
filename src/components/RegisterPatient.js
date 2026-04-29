import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; 
import {useNavigate} from 'react-router-dom';

import { Link } from 'react-router-dom';

const C = {
  primary: "#1E6FE3",
  surface: "#E7E5E4",
  text: "#1E2938",
  textMuted: "#64748B",
  cardShadow: "8px 8px 16px #c4c3c2, -8px -8px 16px #ffffff",
  insetShadow: "inset 4px 4px 8px #c4c3c2, inset -4px -4px 8px #ffffff",
};

function RegisterPatient() { 
  const navigate = useNavigate(); 
  const [form, setForm] = useState({
    
    nom: "",
    prenom: "",
    email: "",
    password: "",
    date_naissance: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/register-patient", form);
      Swal.fire('Success', res.data.message, 'success');
      navigate('/');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', err.response?.data?.error || "Error", 'error');
    }
  };

  return (
    <div style={{minHeight: "100vh", backgroundColor: C.surface, color: C.text, fontFamily: "'Space Mono', monospace", paddingTop: "50px", paddingBottom: "50px"}}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card border-0" style={{backgroundColor: C.surface, boxShadow: C.cardShadow, borderRadius: "20px", padding: "30px"}}>
              <div className="text-center mb-4">
                <div style={{
                    width: "70px", height: "70px", margin: "0 auto 20px", borderRadius: "50%",
                    boxShadow: C.cardShadow, display: "flex", alignItems: "center", justifyContent: "center",
                    color: C.primary, fontSize: "24px"
                }}>
                  <i className="bi bi-person-plus"></i>
                </div>
                <h2 style={{color: C.primary, fontWeight: 700}}>S'inscrire</h2>
                <p style={{color: C.textMuted}}>Veuillez remplir tous les champs !</p>
              </div>

              <div className="card-body px-0" >
                <form onSubmit={handleSubmit}>
                  <div className="row g-4">

                    <div className="col-md-6">
                      <label htmlFor="nom" className="form-label" style={{fontWeight: "bold", fontSize: "0.9rem"}}>Nom</label>
                      <input
                        type="text"
                        className="form-control border-0"
                        id="nom"
                        name="nom"
                        placeholder="Doe"
                        style={{backgroundColor: C.surface, boxShadow: C.insetShadow, color: C.text, padding: "12px", borderRadius: "10px"}}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="prenom" className="form-label" style={{fontWeight: "bold", fontSize: "0.9rem"}}>Prénom</label>
                      <input
                        type="text"
                        className="form-control border-0"
                        id="prenom"
                        name="prenom"
                        placeholder="John"
                        style={{backgroundColor: C.surface, boxShadow: C.insetShadow, color: C.text, padding: "12px", borderRadius: "10px"}}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor="email" className="form-label" style={{fontWeight: "bold", fontSize: "0.9rem"}}>Email</label>
                      <input
                        type="email"
                        className="form-control border-0"
                        id="email"
                        name="email"
                        placeholder="john@example.com"
                        style={{backgroundColor: C.surface, boxShadow: C.insetShadow, color: C.text, padding: "12px", borderRadius: "10px"}}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor="password" className="form-label" style={{fontWeight: "bold", fontSize: "0.9rem"}}>Password</label>
                      <input
                        type="password"
                        className="form-control border-0"
                        id="password"
                        name="password"
                        placeholder="••••••••"
                        style={{backgroundColor: C.surface, boxShadow: C.insetShadow, color: C.text, padding: "12px", borderRadius: "10px"}}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor="date_naissance" className="form-label" style={{fontWeight: "bold", fontSize: "0.9rem"}}>Date de naissance</label>
                      <input
                        type="date"
                        className="form-control border-0"
                        id="date_naissance"
                        name="date_naissance"
                        style={{backgroundColor: C.surface, boxShadow: C.insetShadow, color: C.text, padding: "12px", borderRadius: "10px"}}
                        onChange={handleChange}
                        required
                      />
                    </div>

                   <div className="col-12 mt-5 text-center">
                      <button
                        type="submit"
                        className="btn w-100"
                        style={{backgroundColor: C.surface, color: C.primary, boxShadow: C.cardShadow, fontWeight: "bold", padding: "12px", borderRadius: "10px", border: "none", marginBottom: "20px"}}
                        onMouseDown={(e)=>e.currentTarget.style.boxShadow = C.insetShadow}
                        onMouseUp={(e)=>e.currentTarget.style.boxShadow = C.cardShadow}
                        onMouseLeave={(e)=>e.currentTarget.style.boxShadow = C.cardShadow}
                      >
                        S'inscrire
                      </button>
                      <Link to="/" style={{color: C.textMuted, fontSize: "0.9rem", textDecoration: "none"}}>
                        <i className="bi bi-arrow-left me-1"></i> Retour à la connexion
                      </Link>
                    </div>
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

export default RegisterPatient;