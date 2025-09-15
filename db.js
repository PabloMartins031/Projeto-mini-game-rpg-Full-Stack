const mysql = require('mysql2');

const db = mysql.createConnection({
  host: '127.0.0.1',
  port:3306,
  user: 'root',
  password: 'pablo136589.',
  database: 'rpg_britania'
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('✅ Conectado ao banco de dados MySQL');
  }
});

// export default db
module.exports = db;

