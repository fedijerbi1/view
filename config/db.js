const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'sante_db',
    user: 'postgres',
    password: '147890!?#Ob',
});

pool.connect()
    .then(() => console.log('✅ Connecté à PostgreSQL'))
    .catch(err => console.error('❌ Erreur connexion PostgreSQL:', err));

module.exports = pool;
