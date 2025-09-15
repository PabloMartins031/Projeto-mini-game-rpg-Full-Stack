const express = require('express');
const router = express.Router();
const db = require('./db.js');
const bcrypt = require('bcrypt');

// Cadastro de usuário
router.post('/register', async (req, res) => {
  const { usuario, senha } = req.body;
  if (!usuario || !senha) return res.status(400).send('Usuário ou senha não fornecido');

  const hash = await bcrypt.hash(senha, 10);

  db.query('INSERT INTO usuarios (nome_usuario, senha) VALUES (?, ?)', [usuario, hash], (err, result) => {
    if (err) {
      console.error("Erro ao cadastrar usuário:", err); // <-- console do Node mostra detalhes
      return res.status(500).send('Erro ao cadastrar');
    }
    res.status(200).json({ id_usuario: result.insertId });
  });
});


// Login
router.post('/login', (req, res) => {
  const { usuario, senha } = req.body;

  db.query('SELECT * FROM usuarios WHERE nome_usuario = ?', [usuario], async (err, results) => {
    if (err) return res.status(500).send('Erro no login');
    if (results.length === 0) return res.status(401).send('❌ Usuário não encontrado');

    const usuarioDb = results[0];
    const match = await bcrypt.compare(senha, usuarioDb.senha);

    if (match) {
      res.status(200).json({ id: usuarioDb.id, nome: usuarioDb.nome_usuario });
    } else {
      res.status(401).send('❌ Senha incorreta');
    }
  });
});

// Salvar personagem
router.post('/personagem', (req, res) => {
  const {
    id_usuario, forca, defesa, inteligencia, velocidade, cura,
    tom_pele, classe, cor_cabelo
  } = req.body;

  const query = `
    INSERT INTO personagens (
      id_usuario, forca, defesa, inteligencia, velocidade, cura,
      tom_pele, classe, cor_cabelo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [
  id_usuario, forca, defesa, inteligencia, velocidade, cura,
  tom_pele, classe, cor_cabelo
], (err) => {
  if (err) {
    console.error("Erro ao salvar personagem:", err); // ← log detalhado
    return res.status(500).send('Erro ao salvar personagem');
  }
  res.status(200).send('✅ Personagem salvo');
  });
});

module.exports = router;
