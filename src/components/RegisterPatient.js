import React, { useState } from 'react';
import axios from 'axios';

import { Link } from 'react-router-dom';
function RegisterPatient() {
  const [form, setForm] = useState({
    cin: "",
    nom: "",
    prenom: "",
    email: "",
    password: "",
    date_naissance: "",
    maladie_chronique: ""
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
      const res = await axios.post("http://localhost:5000/register-patient", form);
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error");
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title mb-0">
                <i className="bi bi-hospital me-2"></i>Sign up
              </h2>
              <h4 className="card-subtitle mb-4 text-muted">
                Please fill in all required fields
              </h4>
            </div>
            <div className="card-body" >
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-12">
                    <label htmlFor="cin" className="form-label fw-semibold">CIN</label>
                    <input
                      type="text"
                      className="form-control"
                      id="cin"
                      name="cin"
                      placeholder="CIN"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="nom" className="form-label fw-semibold">Nom</label>
                    <input
                      type="text"
                      className="form-control"
                      id="nom"
                      name="nom"
                      placeholder="Nom"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="prenom" className="form-label fw-semibold">Prénom</label>
                    <input
                      type="text"
                      className="form-control"
                      id="prenom"
                      name="prenom"
                      placeholder="Prénom"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label htmlFor="email" className="form-label fw-semibold">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      placeholder="Email"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label htmlFor="password" className="form-label fw-semibold">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      placeholder="Password"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="date_naissance" className="form-label fw-semibold">Date de naissance</label>
                    <input
                      type="date"
                      className="form-control"
                      id="date_naissance"
                      name="date_naissance"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="maladie_chronique" className="form-label fw-semibold">Maladie chronique<span className="text-muted">(optional)</span></label>
                    <input
                      type="text"
                      className="form-control"
                      id="maladie_chronique"
                      name="maladie_chronique"
                      onChange={handleChange}
                    />
                  </div>

                 <div className="col-12 mt-4 d-flex align-items-center justify-content-center gap-4 flex-wrap">
                    <button
                      type="submit"
                      className="btn btn-primary fw-semibold"
                          
                      
                    >
                      <i className="bi bi-check-lg me-2"></i>Register Patient
                    </button>
                    <Link to="espace-admin" className="text-decoration-none small text-primary">
                      <i className="bi bi-arrow-left me-1"></i>Retour à l’accueil
                    </Link>
                  </div>
                </div>
              </form>
            </div>
            <div className='footers'>
              <small className="text-muted">Secure & confidential</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPatient;