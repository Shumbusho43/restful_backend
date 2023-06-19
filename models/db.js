//connect a function to postgres database
const {
    Pool
} = require('pg');
// Configure the database connection
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: 5432, // Default PostgreSQL port is 5432
});
pool.on('connect', () => {
    console.log('connected to the db');
});

// Export the pool
module.exports = pool;