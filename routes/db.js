// Carga variables de entorno desde un archivo .env
require('dotenv').config({ quiet: true });

// Importa la librería mysql2 en modo Promise
const mysql = require('mysql2/promise');

// Crear un pool de conexiones
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'ojoninja',
  password: process.env.DB_PASSWORD || '170904',
  database: process.env.DB_NAME || 'sistema',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});

module.exports = pool;
