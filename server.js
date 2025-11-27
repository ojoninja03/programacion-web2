// Carga las variables de entorno desde un archivo .env
require('dotenv').config({ quiet: true });

// Importa la app y el pool
const { app, pool } = require('./routes/app');

const PORT = process.env.PORT || 3000;

// (Opcional) ENDPOINT JSON /api/login, por si luego lo usas via fetch
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.json({ ok: false, message: 'Completa usuario y contraseña' });

  try {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE username = ? LIMIT 1',
      [username]
    );

    if (!rows || rows.length === 0)
      return res.json({ ok: false, message: 'Usuario o contraseña inválidos' });

    const user = rows[0];

    if (password !== user.password) {
      return res.json({ ok: false, message: 'Usuario o contraseña inválidos' });
    }

    req.session.userId = user.id;
    req.session.username = user.username;

    return res.json({ ok: true, message: 'Login correcto' });
  } catch (err) {
    console.error('Error en login:', err);
    return res.status(500).json({ ok: false, message: 'Error en servidor' });
  }
});

// Logout JSON
app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

// Para ver si hay sesión activa
app.get('/api/session', (req, res) => {
  if (req.session && req.session.userId) {
    return res.json({ ok: true, username: req.session.username });
  }
  return res.json({ ok: false });
});

// Arranque del servidor
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
