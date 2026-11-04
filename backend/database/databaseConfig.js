
const { Pool } = require("pg");

// Conexão com o PostgreSQL.
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_FORWARD_PORT || process.env.DB_PORT || 5432)
});

module.exports = {
    query: (sql, valores) => pool.query(sql, valores)
};
