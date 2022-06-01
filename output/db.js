import pkg from 'pg';
const { Pool } = pkg;
export const pool = new Pool({
    user: 'gustavo',
    database: 'blueocean',
    password: 'program25056',
    port: 5432,
    host: 'localhost',
});
