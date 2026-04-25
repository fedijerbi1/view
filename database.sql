-- Créer la base de données
CREATE DATABASE sante_db;

-- Table Patient
CREATE TABLE patient (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    age INTEGER,
    sexe VARCHAR(10),
    telephone VARCHAR(20),
    adresse TEXT,
    antecedents_medicaux TEXT,
    allergies TEXT,
    premiere_connexion BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table Médecin
CREATE TABLE medecin (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    specialite VARCHAR(100),
    numero_ordre VARCHAR(50),
    premiere_connexion BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insérer un médecin de test (mot de passe: Temp1234!)
INSERT INTO medecin (nom, prenom, email, mot_de_passe, specialite, numero_ordre, premiere_connexion)
VALUES (
    'Ben Ali',
    'Mohamed',
    'medecin@test.com',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'Cardiologie',
    'MED-001',
    TRUE
);

-- Insérer un patient de test (mot de passe: password)
INSERT INTO patient (nom, prenom, email, mot_de_passe, age, sexe)
VALUES (
    'Trabelsi',
    'Ahmed',
    'patient@test.com',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    30,
    'Homme'
);
