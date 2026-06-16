// --- SEÇÃO: Atualização do nome (em tempo real) ---
const elNome = document.getElementById("lanhouse-nome");

function atualizarUI() {
  const cfg = LanHouseStorage.carregarConfig();
  const nome = cfg && cfg.nomeLanHouse ? cfg.nomeLanHouse : LanHouseStorage.defaults.nomeLanHouse;
  elNome.textContent = nome;

  if (cfg && cfg.corTema) {
    document.documentElement.style.setProperty("--cor-acento", cfg.corTema);
  }
}

atualizarUI();
window.addEventListener("storage", atualizarUI);
setInterval(atualizarUI, 1500);
