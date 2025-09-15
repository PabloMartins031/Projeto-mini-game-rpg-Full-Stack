// 🎵 Controle de música
const musica = document.getElementById('musica-fundo');
const botaoMusica = document.getElementById('musica');
const sliderVolume = document.getElementById('volume');
const controle = document.getElementById('music-control');

let musicaAtiva = false;

// Botão liga/desliga
botaoMusica.addEventListener('click', () => {
  if (musicaAtiva) {
    musica.pause();
    botaoMusica.textContent = '🔇 Música';
  } else {
    musica.play().catch(() => alert("Clique na página para ativar o som."));
    botaoMusica.textContent = '🔊 Música';
  }
  musicaAtiva = !musicaAtiva;
});

// Volume
sliderVolume.addEventListener('input', () => {
  musica.volume = sliderVolume.value;
});

// Iniciar após clique na tela
document.body.addEventListener('click', () => {
  if (!musicaAtiva) {
    musica.volume = sliderVolume.value;
    musica.play();
    botaoMusica.textContent = '🔊 Música';
    musicaAtiva = true;
  }
}, { once: true });

// Expandir botão ao passar o mouse
controle.addEventListener('mouseenter', () => {
  controle.classList.add('expanded');
});
controle.addEventListener('mouseleave', () => {
  controle.classList.remove('expanded');
});

// -------------------- FUNÇÕES DE LOGIN E CADASTRO --------------------

// LOGIN
async function login() {
  const usuario = document.getElementById('login-user').value.trim();
  const senha = document.getElementById('login-pass').value.trim();

  try {
    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, senha })
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || 'Falha no login');
    }

    const data = await res.json();
    alert(`✅ Login bem-sucedido! Bem-vindo, ${data.nome}`);
    localStorage.setItem('usuario_id', data.id_usuario || data.id);

  } catch (err) {
    console.error('Erro no login:', err);
    alert(`❌ Login falhou: ${err.message}`);
  }
}

// CADASTRO + CRIAÇÃO DE PERSONAGEM
async function register() {
  const usuario = document.getElementById('reg-user').value.trim();
  const senha = document.getElementById('reg-pass').value.trim();

  // Valores de personagem (default caso não preenchido)
  const forca = document.getElementById('forca')?.value || 1;
  const defesa = document.getElementById('defesa')?.value || 1;
  const inteligencia = document.getElementById('inteligencia')?.value || 1;
  const velocidade = document.getElementById('velocidade')?.value || 1;
  const cura = document.getElementById('cura')?.value || 1;
  const tom_pele = document.querySelector('input[name="skin"]:checked')?.value || 'clara';
  const classe = document.querySelector('input[name="classe"]:checked')?.value || 'guerreiro';
  const cor_cabelo = document.getElementById('cor-cabelo')?.value || '#000000';

  try {
    // Registrar usuário
    const res = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, senha })
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || 'Falha ao registrar usuário');
    }

    const data = await res.json();
    const id_usuario = data.id_usuario;

    if (!id_usuario) throw new Error('ID de usuário não retornado pelo servidor');

    localStorage.setItem('usuario_id', id_usuario);

    // Salvar personagem
    const resPersonagem = await fetch('http://localhost:3000/api/personagem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_usuario, forca, defesa, inteligencia, velocidade,
        cura, tom_pele, classe, cor_cabelo
      })
    });

    if (!resPersonagem.ok) {
      const msg = await resPersonagem.text();
      throw new Error(msg || 'Falha ao salvar personagem');
    }

    const resultado = await resPersonagem.text();
    alert(`✅ Cadastro concluído!\n${resultado}`);

  } catch (err) {
    console.error('Erro no registro:', err);
    alert(`❌ Erro ao registrar ou salvar personagem: ${err.message}`);
  }
}
