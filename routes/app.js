// ===============================================================
//  CARGA VARIABLES DE ENTORNO
// ===============================================================
require('dotenv').config({ quiet: true });

// ===============================================================
//  IMPORTACIONES
// ===============================================================
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const pool = require('./db'); // sube un nivel si este archivo está en /routes

// Crear App
const app = express();

// Ruta del proyecto
const rootPath = path.join(__dirname, '..');

// ===============================================================
//  CONFIGURACIÓN DE VISTAS
// ===============================================================
app.set('views', path.join(rootPath, 'views'));
app.set('view engine', 'ejs');

// ===============================================================
//  MIDDLEWARES
// ===============================================================
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(rootPath, 'public')));

// ===============================================================
//  SESIONES
// ===============================================================
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secreto',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 }, // 1 hora
  })
);

// ===============================================================
//  LOGGER
// ===============================================================
app.use((req, res, next) => {
  console.log(
    `[HTTP] ${new Date().toISOString()} - ${req.method} ${req.originalUrl}`
  );
  next();
});

// ===============================================================
//  HELPER PARA PROTEGER RUTAS
// ===============================================================
function authRequired(req, res, next) {
  if (req.session && req.session.userId) return next();

  if (req.xhr || req.headers.accept?.includes('application/json')) {
    return res.status(401).json({ ok: false, message: 'No autenticado' });
  }

  return res.redirect('/login');
}

// ===============================================================
//  RUTAS CRUD
// ===============================================================

// -------------------- LISTAR --------------------
app.get('/', authRequired, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email FROM vista ORDER BY id DESC'
    );

    const lista = rows.map((r) => ({
      id: r.id,
      nombre: r.name,
      correo: r.email,
    }));

    res.render('index', {
      lista,
      editId: null,
      username: req.session.username,
    });
  } catch (err) {
    console.error('Error al listar users:', err);
    res.render('index', {
      lista: [],
      editId: null,
      username: req.session.username,
    });
  }
});

// -------------------- AGREGAR --------------------
app.post('/add', authRequired, async (req, res) => {
  const nombre = req.body.name ?? req.body.nombre;
  const correo = req.body.email ?? req.body.correo;

  if (!nombre || !correo) return res.send('Faltan campos');

  try {
    await pool.query('INSERT INTO vista (name, email) VALUES (?, ?)', [
      nombre,
      correo,
    ]);
    return res.redirect('/');
  } catch (err) {
    console.error('Error al agregar usuario:', err);
    return res.send('Error al agregar usuario');
  }
});

// -------------------- ACTUALIZAR --------------------
app.post('/update/:id', authRequired, async (req, res) => {
  const id = Number(req.params.id);
  const name = req.body.name ?? req.body.nombre;
  const email = req.body.email ?? req.body.correo;

  const wantsJson =
    req.xhr ||
    req.is('application/json') ||
    (req.get && req.get('Accept')?.includes('application/json'));

  if (!id || !name || !email) {
    if (wantsJson)
      return res.status(400).json({ ok: false, message: 'Faltan campos' });
    return res.status(400).send('Faltan campos');
  }

  try {
    await pool.query('UPDATE vista SET name=?, email=? WHERE id=?', [
      name,
      email,
      id,
    ]);

    if (wantsJson) return res.json({ ok: true });
    return res.redirect('/');
  } catch (err) {
    console.error('Error al actualizar:', err);
    if (wantsJson)
      return res.status(500).json({ ok: false, message: 'Error al actualizar' });

    return res.status(500).send('Error al actualizar');
  }
});

// -------------------- ELIMINAR --------------------
app.get('/delete/:id', authRequired, async (req, res) => {
  const id = Number(req.params.id);

  if (!id) return res.send('ID inválido');

  try {
    await pool.query('DELETE FROM vista WHERE id = ?', [id]);
    return res.redirect('/');
  } catch (err) {
    console.error('Error al eliminar:', err);
    return res.send('Error al eliminar');
  }
});

// ===============================================================
//  LOGIN
// ===============================================================

// GET /login
app.get('/login', (req, res) => {
  if (req.session && req.session.userId) {
    return res.redirect('/');
  }
  res.render('login', { error: null });
});

// POST /login (form normal)
app.post('/login', async (req, res) => {
  const usernameForm = req.body.username || req.body.usuario;
  const password = req.body.password;

  if (!usernameForm || !password) {
    return res.render('login', { error: 'Faltan usuario o contraseña' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT id, username, password FROM users WHERE username = ? LIMIT 1',
      [usernameForm]
    );

    if (!rows || rows.length === 0) {
      return res.render('login', { error: 'Usuario o contraseña inválidos' });
    }

    const user = rows[0];

    if (password !== user.password) {
      return res.render('login', { error: 'Usuario o contraseña inválidos' });
    }

    req.session.userId = user.id;
    req.session.username = user.username;

    console.log('[LOGIN] Sesión creada:', req.session);

    return res.redirect('/');
  } catch (err) {
    console.error('Error en login:', err);
    return res.render('login', { error: 'Error interno en login' });
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});


module.exports = { app, pool, authRequired };
