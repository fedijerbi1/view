const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ─────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────
const login = async (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email et mot de passe requis.' });
    }

    try {
        // Chercher l'utilisateur selon le rôle
        let query = '';
        if (role === 'medecin') {
            query = 'SELECT * FROM medecin WHERE email = $1';
        } else {
            query = 'SELECT * FROM patient WHERE email = $1';
        }

        const result = await pool.query(query, [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
        }

        const user = result.rows[0];

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.mot_de_passe);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
        }

        // Générer le token JWT
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: role,
                premiere_connexion: user.premiere_connexion
            },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '24h' }
        );

        return res.status(200).json({
            message: 'Connexion réussie.',
            token,
            role,
            premiere_connexion: user.premiere_connexion
        });

    } catch (error) {
        console.error('Erreur login:', error);
        return res.status(500).json({ message: 'Erreur serveur.' });
    }
};

// ─────────────────────────────────────────
// CHANGER MOT DE PASSE - PREMIÈRE CONNEXION
// ─────────────────────────────────────────
const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    const role = req.user.role;

    // Validations
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    if (newPassword.length < 8) {
        return res.status(400).json({ message: 'Le nouveau mot de passe doit contenir au moins 8 caractères.' });
    }

    if (currentPassword === newPassword) {
        return res.status(400).json({ message: 'Le nouveau mot de passe doit être différent de l\'ancien.' });
    }

    try {
        // Récupérer l'utilisateur
        let query = '';
        if (role === 'medecin') {
            query = 'SELECT * FROM medecin WHERE id = $1';
        } else {
            query = 'SELECT * FROM patient WHERE id = $1';
        }

        const result = await pool.query(query, [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Utilisateur introuvable.' });
        }

        const user = result.rows[0];

        // Vérifier le mot de passe actuel
        const isMatch = await bcrypt.compare(currentPassword, user.mot_de_passe);
        if (!isMatch) {
            return res.status(401).json({ message: 'Mot de passe actuel incorrect.' });
        }

        // Hasher le nouveau mot de passe
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Mettre à jour le mot de passe + marquer premiere_connexion = false
        let updateQuery = '';
        if (role === 'medecin') {
            updateQuery = 'UPDATE medecin SET mot_de_passe = $1, premiere_connexion = false WHERE id = $2';
        } else {
            updateQuery = 'UPDATE patient SET mot_de_passe = $1, premiere_connexion = false WHERE id = $2';
        }

        await pool.query(updateQuery, [hashedPassword, userId]);

        return res.status(200).json({
            message: 'Mot de passe modifié avec succès.'
        });

    } catch (error) {
        console.error('Erreur changePassword:', error);
        return res.status(500).json({ message: 'Erreur serveur.' });
    }
};

module.exports = { login, changePassword };
